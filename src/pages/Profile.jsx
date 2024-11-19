import { useNavigate} from "react-router-dom";
import {useState, useEffect} from 'react';
import axios from 'axios';
const baseurl = import.meta.env.REACT_APP_API_BASE_URL;

function Profile() {
    const navigate = useNavigate();

    const [profile, setProfile] = useState({year:1900, month:1, day:1});
    const [status, setState] = useState(2)
    const[alertmodal, setShowModal] = useState(false);
    const[update, setUpdate] = useState(false);
    const[message, setMessage] = useState("")
    const [years, setYears] = useState([])
    const [months, setMonths] = useState([])
    const [days, setDays] = useState([])

    useEffect(()=>{
        
    },[]);
    const handleChangeYear = (e)=>{
        handleChange(e.target.value,"year")
        setDays([...Array(new Date(e.target.value, profile?.month ? profile.month : 1, 0).getUTCDate() + 1).keys()].map(i => i + 1));
    }
    const handleChnageMonth = (e)=>{
        handleChange(e.target.value,"month");
        setDays([...Array(new Date(profile?.year ? profile.year : 1990, e.target.value, 0).getUTCDate() + 1).keys()].map(i => i + 1));
    }

    useEffect(()=>{
        setYears([...Array(new Date().getFullYear() - 1900 + 1).keys()].map(i => i + 1900));
        setMonths([...Array(12).keys()].map(i => i + 1));
        setDays([...Array(new Date(1900, 1, 0).getUTCDate() + 1).keys()].map(i => i + 1));

        var userData =  JSON.parse(localStorage.getItem("userData")) || null;
        if(!userData){
            navigate("/login")
        }
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
            if(response.data.data.year){
                setUpdate(true)
            }
            setProfile(response.data.data)
            setState(response.data.data.status)
        })
        .catch((error)=>{
            if (error.response) {
                if(error.response.status===401){
                    localStorage.removeItem("userData");
                    window.location.assign('/');
                }
            }
        });
    },[])

    const handleGoback = (e) =>{
        e.preventDefault();
        localStorage.removeItem("userData");
        window.location.assign('/');
        // navigate(-1);
    }
    const handleSubmit = (e) =>{
        e.preventDefault();
        var userData =  JSON.parse(localStorage.getItem("userData")) || null;
        var token = userData.token;
        let year=1900;
        let month = 1;
        let day = 1;
        if(profile.year && profile?.year!==""){
            year = profile.year
        }
        if(profile.month && profile?.month!==""){
            month = profile.month
        }
        if(profile.day && profile?.day!==""){
            day = profile.day
        }
        let config = {
            method: 'post',
            url: `${baseurl}/api/update_profile`,
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            data :  JSON.stringify(
                {
                    year:year,
                    month:month,
                    day:day,
                    gender:profile?.gender?profile?.gender:1,
                    wedding:profile?.wedding?profile?.wedding:1,
                    job:profile?.job?profile?.job:0,
                    hobby:profile?.hobby?profile?.hobby:0,
                    child:profile?.child?profile?.child:false,
                    salary:profile?.salary?profile?.salary:0
                }
            ),
        };
        axios(config)
        .then((response) => {
            navigate("/start")
        })
        .catch((error)=>{
            if (error.response) {
                if(error.response.status===401){
                    localStorage.removeItem("userData");
                    window.location.assign('/');
                }
            }
        })
    }

    const handleChange=(val, key)=>{
        setProfile({...profile, [key]:val})
    }

    return(
        <>
            <header>
                <div className="wrap">
                    <a  onClick={()=>navigate(-2)} className="back">
                        <span>戻る</span>
                    </a>
                   
                    <a href="/plan" className="plan-setting">
                        <span>プラン変更</span>
                        <img src="./assets/images/star.png" alt=""/>
                    </a>
                    
                </div>
            </header>
            <main>
                <div className="profile bg">
                    <div className="container">
                    <h2 className="profile-ttl">
                        プロフィール設定
                    </h2>
                    <div className="profile-txt">
                        設定することで、より詳しく<br className="sp-only"/>占うことができます。
                    </div>
                    <form action="" className="form">
                        <div className="form-part">
                        <div className="form-item w-48">
                            <label htmlFor="">年</label>
                            <select name="" id="" value={profile?.year ? profile.year : 1900} onChange={(e)=>handleChangeYear(e)}>
                                    {years.map((item, index)=>(
                                        <option value={item} key={index}>{item}</option>
                                    ))}
                            </select>
                           
                        </div>
                        <div className="form-item w-20">
                            <label htmlFor="">月</label>
                            <select name="" id="" value={profile?.month ? profile.month : 1} onChange={(e)=>handleChnageMonth(e)}>
                                    {months.map((item, index)=>(
                                        <option value={item} key={index}>{item}</option>
                                    ))}
                            </select>
                        </div>
                        <div className="form-item w-20">
                            <label htmlFor="">日</label>
                            <select name="" id="" value={profile?.day ? profile.day : ""} onChange={(e)=>{handleChange(e.target.value,"day")}}>
                                    {days.map((item, index)=>(
                                        <option value={item} key={index}>{item}</option>
                                    ))}
                            </select>
                        </div>
                        </div>
                        <div className="form-part">
                        <div className="form-item w-48">
                            <label htmlFor="">性別</label>
                            <div className="form-item-wrap" onClick={(e)=>{handleChange(1,"gender")}}>
                                <input type="radio" name="sex" onChange={()=>{}}  checked={profile?.gender==1}/>
                                <span>男性</span>
                            </div>
                        </div>
                        <div className="form-item w-48">
                            <label htmlFor=""></label>
                            <div className="form-item-wrap" onClick={(e)=>{handleChange(2,"gender")}}>
                            <input type="radio" name="sex" onChange={()=>{}}  checked={profile?.gender==2}/>
                            <span>女性</span>
                            </div>
                        </div>
                        </div>
                        <div className="form-part">
                        <div className="form-item w-48">
                            <label htmlFor="">結婚</label>
                            <div className="form-item-wrap" onClick={(e)=>{handleChange(1,"wedding")}}>
                                <input type="radio" name="marriage" onChange={()=>{}} checked={profile?.wedding==1}/>
                                <span>既婚</span>
                            </div>
                        </div>
                        <div className="form-item w-48">
                            <label htmlFor=""></label>
                            <div className="form-item-wrap"  onClick={(e)=>{handleChange(2,"wedding")}}>
                            <input type="radio" name="marriage" onChange={()=>{}} checked={profile?.wedding==2}/>
                            <span>未婚</span>
                            </div>
                        </div>
                        </div>
                        <div className="form-part">
                        <div className="form-item w-100">
                            <label htmlFor="">職業</label>
                            <select  value={profile?.job ? profile.job : 0} onChange={(e)=>{handleChange(e.target.value,"job")}}>
                                <option value="0" disabled></option>
                                <option value="1=会社員">会社員</option>
                                <option value="学生">学生</option>
                                <option value="フリーター">フリーター</option>
                                <option value="公務員">公務員</option>
                                <option value="事務員">事務員</option>
                                <option value="商社">商社</option>
                                <option value="金融">金融</option>
                                <option value="クリエイター">クリエイター</option>
                                <option value="IT関連">IT関連</option>
                                <option value="航空関係">航空関係</option>
                                <option value="芸能関係">芸能関係</option>
                                <option value="アパレル関係">アパレル関係</option>
                                <option value="エンターテイメント">エンターテイメント</option>
                                <option value="看護師">看護師</option>
                                <option value="経営者・役員">経営者・役員</option>
                                <option value="医師">医師</option>
                                <option value="弁護士">弁護士</option>
                                <option value="会計士・税理士">会計士・税理士</option>
                                <option value="看護師">看護師</option>
                                <option value="保育士">保育士</option>
                                <option value="調理師・栄養士">調理師・栄養士</option>
                                <option value="教育関連">教育関連</option>
                                <option value="食品関連">食品関連</option>
                                <option value="製薬">製薬</option>
                                <option value="保険">保険</option>
                                <option value="不動産">不動産</option>
                                <option value="WEB業界">WEB業界</option>
                                <option value="接客業">接客業</option>
                                <option value="美容関係">美容関係</option>
                                <option value="旅行関係">旅行関係</option>
                                <option value="ブライダル">ブライダル</option>
                                <option value="福祉・介護">福祉・介護</option>
                                <option value="広告">広告</option>
                                <option value="マスコミ">マスコミ</option>
                                <option value="スポーツ関連">スポーツ関連</option>
                                <option value="投資家">投資家</option>
                                <option value="アナウンサー">アナウンサー</option>
                                <option value="エステティシャン">エステティシャン</option>
                                <option value="出版">出版</option>
                                <option value="建築・インテリア">建築・インテリア</option>
                                <option value="研究職">研究職</option>
                                <option value="その他">その他</option>                           
                            </select>
                        </div>
                        </div>
                        <div className="form-part">
                            <div className="form-item w-100">
                                <label htmlFor="">趣味</label>
                                <select value={profile?.hobby ? profile.hobby : 0} onChange={(e)=>{handleChange(e.target.value,"hobby")}}>
                                    <option value="0" disabled></option>
                                    <option value="カフェ巡り">カフェ巡り</option>
                                    <option value="映画鑑賞">映画鑑賞</option>
                                    <option value="音楽鑑賞">音楽鑑賞</option>
                                    <option value="散歩">散歩</option>
                                    <option value="読書">読書</option>
                                    <option value="キャンプ">キャンプ</option>
                                    <option value="サーフィン">サーフィン</option>
                                    <option value="ドライブ">ドライブ</option>
                                    <option value="釣り">釣り</option>
                                    <option value="ペット">ペット</option>
                                    <option value="ネイル">ネイル</option>
                                    <option value="料理">料理</option>
                                    <option value="登山">登山</option>
                                    <option value="ゲーム">ゲーム</option>
                                    <option value="温泉巡り">温泉巡り</option>
                                    <option value="ヨガ">ヨガ</option>
                                    <option value="音楽・楽器">音楽・楽器</option>
                                    <option value="茶道">茶道</option>
                                    <option value="絵画">絵画</option>
                                    <option value="陶芸">陶芸</option>
                                </select>
                            </div>
                        </div>
                        <div className="form-part">
                        <div className="form-item w-48">
                            <label htmlFor="">子供</label>
                            <div className="form-item-wrap" onClick={(e)=>{handleChange(true,"child")}}>
                            <input type="radio" name="child" onChange={()=>{}} checked={profile?.child==true}/>
                            <span>あり</span>
                            </div>
                        </div>
                        <div className="form-item w-48">
                            <label htmlFor=""></label>
                            <div className="form-item-wrap" onClick={(e)=>{handleChange(false,"child")}}>
                            <input type="radio" name="child" onChange={()=>{}} checked={profile?.child==false}/>
                            <span>なし</span>
                            </div>
                        </div>
                        </div>
                        <div className="form-part">
                            <div className="form-item w-100">
                                <label htmlFor="">年収</label>
                                <select value={profile?.salary ? profile.salary : 0} onChange={(e)=>{handleChange(e.target.value,"salary")}}>
                                    <option value="0"></option>
                                    <option value="50 ~ 100万">50 ~ 100万</option>
                                    <option value="101 ~ 300万">101 ~ 300万</option>
                                    <option value="301 ~ 500万">301 ~ 500万</option>
                                    <option value="501 ~ 700万">501 ~ 700万</option>
                                    <option value="701 ~ 800万">701 ~ 800万</option>
                                    <option value="3801 ~ 1000万">3801 ~ 1000万</option>
                                    <option value="1001 ~ 1500万">1001 ~ 1500万</option>
                                    <option value="1501 ~ 2000万">1501 ~ 2000万</option>
                                    <option value="2001 ~ 5000万">2001 ~ 5000万</option>
                                    <option value="5001 ~ 1億">5001 ~ 1億</option>
                                </select>
                            </div>
                        </div>
                    </form>
                    <a  onClick={handleSubmit} className="btn btn-primary">{update ? "プロフィールを更新": "プロフィール登録"}</a>
                    <a onClick={handleGoback} className="anchor">ログアウト</a>
                    </div>
                </div>
                <div className={alertmodal?"modal modal-show":"modal"} onClick={(e)=>{setShowModal(false)}}>
                <div className="modal-body" onClick={(e)=>{e.stopPropagation()}}>
                    <p>{message}</p>
                </div>
            </div>
            </main>
        </>
    )
}
export default Profile;