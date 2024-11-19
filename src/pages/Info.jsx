import { useNavigate} from "react-router-dom";
import {useState, useEffect} from 'react';

function Info() {
    const navigate = useNavigate();
    const [year, setYear] = useState(1900)
    const [month, setMonth] = useState(1)
    const [day, setDay] = useState(1)
    const [gender, setGender] = useState(1);
    const [years, setYears] = useState([])
    const [months, setMonths] = useState([])
    const [days, setDays] = useState([])
    const handleSubmit = () =>{
        navigate("/start",{
            state: {
                year:year,
                month:month,
                day:day,
                gender:gender
            }
        })
    }

    useEffect(()=>{
        setYears([...Array(new Date().getFullYear() - 1900 + 1).keys()].map(i => i + 1900));
        setMonths([...Array(12).keys()].map(i => i + 1));
        setDays([...Array(new Date(1900, 1, 0).getUTCDate() + 1).keys()].map(i => i + 1));
    },[]);
    const handleChangeYear = (e)=>{
        setYear(e.target.value)
        setDays([...Array(new Date(e.target.value, month, 0).getUTCDate() + 1).keys()].map(i => i + 1));
    }
    const handleChnageMonth = (e)=>{
        setMonth(e.target.value);
        setDays([...Array(new Date(year, e.target.value, 0).getUTCDate() + 1).keys()].map(i => i + 1));
    }

    return(
        <main>
            <div className="info bg">
            <div className="container">
                <h2 className="info-ttl">
                あなたについて<br className="sp-only"/>教えてください
                </h2>
                <form action="" className="form">
                <div className="form-part">
                    <div className="form-item w-45">
                    <label htmlFor="">年</label>
                        <select name="" id="" value={year} onChange={(e)=>handleChangeYear(e)}>
                            {years.map((item, index)=>(
                                <option value={item} key={index}>{item}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-item w-20">
                    <label htmlFor="">月</label>
                    <select name="" id="" value={month} onChange={(e)=>handleChnageMonth(e)}>
                            {months.map((item, index)=>(
                                <option value={item} key={index}>{item}</option>
                            ))}
                    </select>
                    </div>
                    <div className="form-item w-20">
                    <label htmlFor="">日</label>
                    <select name="" id="" value={day} onChange={(e)=>setDay(e.target.value)}>
                        {days.map((item, index)=>(
                            <option value={item} key={index}>{item}</option>
                        ))}
                    </select>                    
                    </div>
                </div>
                <div className="form-part">
                    <div className="form-item w-45">
                        <label htmlFor="">性別</label>
                        <div onClick={()=>setGender(1)} className="form-item-wrap" htmlFor="sex">
                            <input type="radio" name="sex" onChange={()=>{}}  checked={gender==1}/>
                            <span>男性</span>
                        </div>
                    </div>
                    <div className="form-item w-45">
                    <label htmlFor=""></label>
                    <div  onClick={()=>setGender(2)} className="form-item-wrap" htmlFor="sex">
                        <input type="radio" onChange={()=>{}} name="sex" checked={gender==2}/>
                        <span>女性</span>
                    </div>
                    </div>
                </div>
                </form>
                <a href="" onClick={handleSubmit} className="btn btn-common">占いSTART</a>
                <a href="/login" className="anchor">既に会員の方はこちら</a>
            </div>
            </div>
        </main>
    )
}
export default Info;