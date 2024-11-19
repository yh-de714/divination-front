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
    const[alertmodal, setShowModal] = useState(false);
    const[message, setMessage] = useState("")

    const handleSubmit = (event)=>{
        event.preventDefault();
        let data = JSON.stringify({
            "email":email,
            "username":email,
            "password":password
        });
        let config = {
            method: 'post',
            url: `${baseurl}/api/login`,
            headers: { 
                'Content-Type': 'application/json'
            },
                data : data,
        };
        axios(config)
        .then(async (response) => {
            setUserData({token:response.data.token,refresh:response.data.refresh, status:response.data.userStatus});
            window.location.assign("/start");
        })
        .catch((error)=>{
            setShowModal(true);
            setMessage("ユーザーが見つかりません。");
        })
    }

    return(
        <main>
            <div className="login bg">
                <div className="container">
                <h2 className="login-ttl">
                    ログイン
                </h2>
                <form action="" className="form">
                    <div className="form-part">
                    <div className="form-item w-100">
                        <label htmlFor="">メールアドレス</label>
                        <input type="text" value={email} onChange={(e)=>{setEmail(e.target.value)}}/>
                    </div>
                    </div>
                    <div className="form-part">
                    <div className="form-item w-100">
                        <label htmlFor="">パスワード</label>
                        <input type="password" value={password} onChange={(e)=>{setPassword(e.target.value)}}/>
                    </div>
                    </div>        
                </form>
                <a href="" onClick={handleSubmit} className="btn btn-primary">ログイン</a>
                <a href="/register" className="anchor">新規会員登録はこちら</a>
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