import { useNavigate,useLocation} from "react-router-dom";
import {useState, useEffect} from 'react';
import axios from 'axios';
const baseurl = import.meta.env.REACT_APP_API_BASE_URL;

function Start() {
    const location = useLocation();
    const navigate = useNavigate();
    const [user, setUser] = useState(null)
    const [year, setYear] = useState(null)
    const [month, setMonth] = useState(null)
    const [day, setDay] = useState(null)
    const [gender, setGender] = useState(null)
    const [state, setState] = useState(0)
    const [load, setload] = useState(false)

    useEffect(()=>{
        var userData =  JSON.parse(localStorage.getItem("userData")) || null;
        if(!userData){
            if(location.state){
                setYear(location.state.year)
                setMonth(location.state.month)
                setDay(location.state.day)
                setGender(location.state.gender)
                setload(true)
            }
           
            else{
                navigate("/info")
            }
        }
        else{
            var token = userData.token;
            var config = {
                method: 'get',
                url: `${baseurl}/api/get-profile`,
                headers: { 
                    'Authorization': 'Bearer ' + token
                },
                    data : {},
            };
            axios(config)
            .then((response) => {
                if(response.data.data.day && response.data.data.month && response.data.data.year){
                    setYear(response.data.data.year)
                    setMonth(response.data.data.month)
                    setDay(response.data.data.day)
                    setGender(response.data.data.gender)
                    setState(response.data.data.status)
                    setload(true)
                }
                else{
                    navigate("/profile")
                }
            })
            .catch((error)=>{
                if (error.response) {
                    if(error.response.status===401){
                        localStorage.removeItem("userData");
                        window.location.assign('/');
                    }
                }
            });
        }
    },[])

    const handleClick = (parameter)=>{
        if(!load) return
        navigate("/process",{
            state:{
                year:year,
                month:month,
                day:day,
                gender:gender,
                state:state,
                parameter:parameter
            }
        })
    }

    return(
        <main>
            <div className="select bg">
            <div className="container">
                <h2 className="select-ttl">
                占い師を<br className="sp-only"/>選んでください
                </h2>
                <div className="select-body">
                <div className="select-item" onClick={()=>handleClick(1)}>
                    <figure>
                    <img src="./assets/images/uranaishi1.png" alt=""/>
                    </figure>
                    <div className="select-item-name">
                    ローズ・ロマンサー
                    </div>
                    <div className="select-item-sort">
                        恋愛運の占い師
                    </div>
                </div>
                <div className="select-item" onClick={()=>handleClick(2)}>
                    <figure>
                    <img src="./assets/images/uranaishi2.png" alt="" />
                    </figure>
                    <div className="select-item-name">
                    カルマン・ビジョン
                    </div>
                    <div className="select-item-sort">
                    仕事運の占い師
                    </div>
                </div>
                <div className="select-item" onClick={()=>handleClick(3)}>
                    <figure>
                    <img src="./assets/images/uranaishi3.png" alt=""/>
                    </figure>
                    <div className="select-item-name">
                    カシャ・キセキ
                    </div>
                    <div className="select-item-sort">
                    金運の占い師
                    </div>
                </div>
                <div className="select-item" onClick={()=>handleClick(4)}>
                    <figure>
                    <img src="./assets/images/uranaishi4.png" alt=""/>
                    </figure>
                    <div className="select-item-name">
                    コネクト・クローバー
                    </div>
                    <div className="select-item-sort">
                    人間関係の占い師
                    </div>
                </div>
                <div className="select-item" onClick={()=>handleClick(5)}>
                    <figure>
                    <img src="./assets/images/uranaishi5.png" alt=""/>
                    </figure>
                    <div className="select-item-name">
                    セレナ・サーガ
                    </div>
                    <div className="select-item-sort">
                    運命の占い師
                    </div>
                </div>
                <div className="select-item" onClick={()=>handleClick(6)}>
                    <figure>
                    <img src="./assets/images/uranaishi6.png" alt=""/>
                    </figure>
                    <div className="select-item-name">
                    ノヴァ・ナウ
                    </div>
                    <div className="select-item-sort">
                    今日の運勢の占い師
                    </div>
                </div>
                </div>
            </div>
            </div>
        </main>
    )
}
export default Start;