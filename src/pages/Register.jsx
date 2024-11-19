
import { useNavigate} from "react-router-dom";
import { useState} from 'react'
import axios from 'axios';

const baseurl = import.meta.env.REACT_APP_API_BASE_URL;

function setUserData(userdata) {
    localStorage.setItem("userData", JSON.stringify(userdata))
}

function Login() {

    const navigate = useNavigate();
    const[email, setEmail] = useState("")
    const[password, setPassword] = useState("")
    const[firstName, setFirstName] = useState("")
    const[lastName, setLastName] = useState("")
    const[alertmodal, setShowModal] = useState(false);
    const[message, setMessage] = useState("")

    const handleSubmit = (event)=>{
        event.preventDefault();
        var emailregax = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        if (!email.match(emailregax)) {
            setShowModal(true);
            setMessage("メールアドレスが正しくありません。");
            return true;
        }
        if(password==""){
            setShowModal(true);
            setMessage("パスワードが正しくありません。");
            return
        }
        let data = JSON.stringify({
            "first_name":firstName,
            "last_name":lastName,
            "email":email,
            "password":password
        });
        let config = {
            method: 'post',
            url: `${baseurl}/api/signup`,
            headers: { 
                'Content-Type': 'application/json'
            },
                data : data,
        };
        axios(config)
        .then((response) => {
            setUserData({token:response.data.token,refresh:response.data.refresh, status:response.data.userStatus});
            window.location.assign("/profile");
            
        })
        .catch((error)=>{
            if(error.response){
                if(error.response.data)
                {
                    var errordata = error.response.data;
                    if(errordata.email){
                        setShowModal(true);
                        setMessage("この電子メール アドレスを持つユーザーは既に存在します。");
                    }
                }
            }
        })
    }

    return(
        <main>
            <div className="register bg">
                <div className="container">
                <h2 className="register-ttl">
                    無料会員登録
                </h2>
                <form action="" className="form">
                    <div className="form-part">
                    <div className="form-item w-48">
                        <label htmlFor="">氏</label>
                        <input type="text" value={firstName} onChange={(e)=>setFirstName(e.target.value)}/>
                    </div>
                    <div className="form-item w-48">
                        <label htmlFor="">名</label>
                        <input type="text" value={lastName} onChange={(e)=>setLastName(e.target.value)}/>
                    </div>
                    </div>
                    <div className="form-part">
                    <div className="form-item w-100">
                        <label htmlFor="">メールアドレス</label>
                        <input type="text" value={email} onChange={(e)=>setEmail(e.target.value)}/>
                    </div>
                    </div>
                    <div className="form-part">
                    <div className="form-item w-100">
                        <label htmlFor="">パスワード</label>
                        <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)}/>
                    </div>
                    </div>
                </form>
                <a href="" onClick={handleSubmit} className="btn btn-primary">無料会員登録</a>
                <a href="/login" className="anchor">既に会員の方はこちら</a>
                </div>
            </div>
            <div className={alertmodal?"modal modal-show":"modal"} onClick={(e)=>{setShowModal(false)}}>
                <div className="modal-body" onClick={(e)=>{e.stopPropagation()}}>
                    <p>{message}</p>
                </div>
            </div>
        </main>
    )
}
export default Login;