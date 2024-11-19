import { useNavigate,useLocation} from "react-router-dom";
import {useEffect, useState, useRef} from 'react'

import axios from 'axios';
import Conversation from "../conversation";
import defaultSettings from "../characters";
const baseurl = import.meta.env.REACT_APP_API_BASE_URL;


const ContentEditable = (props) => {
    
  const [initialValue] = useState(props.value);
  const handleInput = (event) => {
    if (props.onChange) {
      props.onChange(event.target.innerHTML);
    }
  };

    return (
        <span
        contentEditable
        onInput={handleInput}
        className="textarea"
        data-placeholder={props.placeholder}
        dangerouslySetInnerHTML={{ __html: initialValue }}
        />
    );
  };

function Process() {
    
    const location  = useLocation()
    const navigate = useNavigate()
    const [text, setText] = useState("")
    const [typing, setTyping] = useState(true)
    const [chatting, setChat] = useState([])
    const [limit, setLimit] = useState(3)
    const [placeholder, setPlaceholder] = useState("なんでも聞いてみましょう")
    const [status, setStatus] = useState(location.state?.state)
    const [topclass, setTopClass] = useState("top")
    const messagesEndRef = useRef(null)

    const userData =  JSON.parse(localStorage.getItem("userData")) || null;
    let data;
    if(location.state){
        data = {
            "year":location.state.year,
            "month":location.state.month,
            "day":location.state.day,
            "state":location.state.state,
            "gender":location.state.gender,
            "parameter":location.state.parameter,
        };
    }
    else{
        navigate("/info")
    }
    
    var ranonce = false;    
    const keydownHandler = (e) => {
        if(e.key === 'Enter' && (e.shiftKey)){
            return true
        }
        if(e.key === 'Enter' )
        {
            handleSend()
        }
        
    };

    const scrollHandler = (e)=>{
        let activeClass = 'normal';
        if(window.scrollY === 0){
            activeClass = 'top';
        }
        setTopClass(activeClass);
    }

    const handleSend= ()=>{
        
        if(text!==""){
            var div = document.createElement("div");
            div.innerHTML = text;
            var replacetext = div.textContent || div.innerText || "";           
            setChat([...chatting,  {recive:false, data:text}]);
            setText("");
            setTyping(true)     
            
            if(limit > 0)
            {
                setLimit(limit - 1)
                if(limit < 10)
                    setPlaceholder(`なんでも聞いてみましょう (あと${limit - 1}回)`)
                else
                    setPlaceholder(`なんでも聞いてみましょう`)
                    
                handleSubmit(replacetext)
                             
            }
            {
                setPlaceholder(`なんでも聞いてみましょう`)
            }          
        }
    }

    const handleSubmit = (message) => {
        
        var userData =  JSON.parse(localStorage.getItem("userData")) || null;
        let config = {};
        let data = JSON.stringify({
            "message":message,
        });
       
        if(userData){
            var token = userData.token;
            config={
                method: 'post',
                url: `${baseurl}/api/chat`,
                withCredentials: true,
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                },
                data : data,
            };
        }
        else{
            config={
                method: 'post',
                url: `${baseurl}/api/chat`,
                withCredentials: true,
                headers: { 
                    'Content-Type': 'application/json'
                },
                data : data,
            };
        }
        
        axios(config)
        .then((response) => {
            setChat([...chatting,{recive:false, data:text},{recive:true, data:response.data}])
            setTyping(false)           
        })
        .catch((error)=>{
           
        })
    }

    useEffect(()=>{        
        if (!ranonce) {
                        
            if(!location.state){
                navigate("/info")
            }
          
            else{                
                let lim = 3
                if(location.state.state==0)
                {
                    setLimit(3)
                    setPlaceholder(`なんでも聞いてみましょう (あと3回)`)
                    lim = 3
                }
                else if(location.state.state==1)
                {
                    setLimit(5)
                    setPlaceholder(`なんでも聞いてみましょう (あと5回)`)
                    lim  = 5
                }
                else{                    
                    setLimit(10000)
                    lim = 10000
                }
                handleCreate(lim)
            }            
            ranonce = true
        }
    },[])

    useEffect(()=>{
        document.addEventListener('keydown', keydownHandler);
        window.addEventListener('scroll', scrollHandler); 
        return () => {
            window.removeEventListener('scroll', scrollHandler)
            document.removeEventListener('keydown', keydownHandler);
        }
        
    })

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    const handleCreate = (lim) =>{
        var userData =  JSON.parse(localStorage.getItem("userData")) || null;
        let config = {};
        if(userData){
            var token = userData.token;
            config = {
                method: 'post',
                withCredentials: true,
                url: `${baseurl}/api/create-chat`,
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                },
                    data : JSON.stringify(data),
            };
        }
        else{
            config = {
                method: 'post',
                withCredentials: true,
                url: `${baseurl}/api/create-chat`,
                headers: { 
                    'Content-Type': 'application/json'
                },
                    data : JSON.stringify(data),
            };
        }     
        axios(config)
        .then((response) => {
            setChat([...chatting, ...response.data.filter((item,index)=>((index!==0 && index!==1))).map((item)=>({recive:item.role=="assistant",data:item.content}))])
            setLimit(lim - (response.data.length - 2) / 2)
            setTyping(false)           
        })
        .catch((error)=>{
            if(error.response.status===401){
                localStorage.removeItem("userData");
                window.location.assign('/');
            }
        })
    }
    
    useEffect(() => {
        scrollToBottom()
    }, [chatting]);

    return(
        <>
        <header className={topclass}>
            <div className="wrap">
            <a onClick={()=>navigate(-1)} className="hero-select">
                <img src={`./assets/images/uranaishi${data.parameter}.png`} alt=""/>
                <span>占い師を選ぶ</span>
            </a>
            { status==0 &&
                <a href="/login" className="head-setting login-setting active">
                    <span>ログイン</span>
                    <img src="./assets/images/login.svg" alt=""/>
                </a>
            }
            {
                status!=0 &&
                    <a href="/profile" className="head-setting profile-setting">
                    <span>プロフィール</span>
                    <img src="./assets/images/user.svg" alt=""/>
                </a>
            }            
            </div>
        </header>
        <main>
            <div className={`process bg bg${data.parameter}`}>
            <div className="container">
                <h2 className="process-ttl">
                AI占い師
                </h2>
                <div className="process-body">
                    <div className="process-part">
                        {chatting.map((item,index)=>(
                            <div className="process-wrap" key={index} style={{position:"relative"}}>
                                <div className="process-avatar">
                                    {item.recive && <img src={`./assets/images/uranaishi${data.parameter}.png`} alt=""/>}
                                </div>
                                <div  className="process-txt"
                                    dangerouslySetInnerHTML={{ __html: item.data }}/>
                            </div>
                            ))                    
                        }

                        {typing && <div className="process-wrap" style={{position:"relative"}}>
                                <div className="process-avatar">
                                <img src={`./assets/images/uranaishi${data.parameter}.png`} alt=""/>
                                </div>
                                <div className="process-txt loader">
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                </div>
                        </div>}                       
                        <div ref={messagesEndRef} />                    
                        
                    </div>
                </div>
                <form onSubmit={(e)=>{
                    e.preventDefault();
                    handleSend();
                }}>
                    {!typing && limit!==0 && 
                    <div className="process-send active">
                        <ContentEditable value={text} onChange={setText} placeholder={placeholder}/>
                        <button type="submit"> 
                            <a href=""><img src="./assets/images/send.svg" alt=""/></a>
                        </button>
                    </div>
                    }
                </form>
                { status==1 && limit<=0 &&
                    <div className="process-send">
                        <span>なんでも聞いてみましょう (あと0回)</span>
                        <a href="/plan"
                        ><span>プランを変更する</span></a>
                    </div>
                }
            </div>
            { status==0 && limit<=0 &&
                <div className="consulting">
                    <div className="container">
                    <div className="consulting-ttl">
                        もっと相談する
                    </div>
                    <div className="consulting-txt">
                        会員登録するとより詳しく、もっとたくさん<br/>
                        占うことができます。
                    </div>
                    <a href="/register" className="btn btn-common">無料会員登録</a>
                    </div>
                </div>
            }
            </div>
        </main>
        </>
    )
}
export default Process;