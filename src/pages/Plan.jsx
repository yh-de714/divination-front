import {useState, useEffect} from 'react'
import { useNavigate,useLocation} from "react-router-dom";
import {
    useStripe
} from '@stripe/react-stripe-js';

import axios from 'axios';

const baseurl = import.meta.env.REACT_APP_API_BASE_URL;

const PRODUCT_PLANS = [
    {
        price_info: [{
            price: 'price_1N14Z2Fd0IMPd3rDiHWmz5hX',
            quantity: 1
        }],
        name: 'Premium',
        price: ['8800'],
        currency: "¥",
        interval: "monthly",
        trial_period_days: null,
    }
]

// const PRODUCT_PLANS = [
//     {
//         price_info: [{
//             price: 'price_1MnehfHAKhp7glCMSHIuN9g7',
//             quantity: 1
//         }],
//         name: 'Premium',
//         price: ['8800'],
//         currency: "¥",
//         interval: "monthly",
//         trial_period_days: null,
//     }
// ]



function Plan() {
    const navigate = useNavigate()
    const stripe = useStripe();
    const [originPlan, setOriginPlan] = useState(null)
    const [plan, setPlan] = useState(null);

    const handleSubmit = ()=>{
        if(plan==1){
            let userData =  JSON.parse(localStorage.getItem("userData")) || null;
            let token = userData.token;

            let data = JSON.stringify({"price_info":PRODUCT_PLANS[0].price_info});
            let  config= {
                method: 'POST',
                url: `${baseurl}/api/create-checkout-session`,
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                },
                data : data
            };
    
            axios(config)
            .then(async (response)=>{            

                let data1 = JSON.stringify({"session_id":response.data.result});
                config= {
                    method: 'POST',
                    url: `${baseurl}/api/update-payment-method`,
                    headers: { 
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token
                    },
                    data : data1
                };
                axios(config)      
                    const result = await stripe.redirectToCheckout({
                    sessionId: response.data.result,
                });

                navigate("/start")
            
            })
            .catch((error)=>{
            // setModalshow(true);
            // setErrorMessage("失敗しました。");
            });
        }
        else{
            var userData =  JSON.parse(localStorage.getItem("userData")) || null;
            if(!userData){
                navigate("/login")
            }
            let data = JSON.stringify({"plan":plan});
            var token = userData.token;
            var config = {
                method: 'post',
                url: `${baseurl}/api/cancel-plan`,
                headers: { 
                    'Authorization': 'Bearer ' + token
                },
                    data : data,
            };
            axios(config)
            .then((response) => {
                console.log(response)
                navigate("/start")
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
    }
    
    useEffect(()=>{
        var userData =  JSON.parse(localStorage.getItem("userData")) || null;
        if(!userData){
            navigate("/login")
        }
        var token = userData.token;
        var config = {
            method: 'get',
            url: `${baseurl}/api/get-plan`,
            headers: { 
                'Authorization': 'Bearer ' + token
            },
                data : {},
        };
        axios(config)
        .then((response) => {
           setPlan(response.data.plan)
           setOriginPlan(response.data.plan)
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

    return(
        <>
        <header>
                <div className="wrap">
                    <a  onClick={()=>navigate("/start")} className="back">
                        <span>戻る</span>
                    </a>                    
                </div>
        </header>
        <main>
            <div className="plan bg">
                <div className="container">
                <h2 className="plan-ttl">
                    プラン
                </h2>
                <div className="plan-body">
                    <div className={`plan-item ${plan==0 ? 'active' : ""}`} onClick={()=>setPlan(0)}>
                        {/* <div className="plan-item-avatar">
                            <img src="./assets/images/job_uranaishi.png" alt=""/>
                        </div> */}
                        <div className="plan-item-wrap">
                            <div className="plan-item-sort">
                            FREE
                            </div>
                            <div className="plan-item-cost">
                            0円
                            </div>
                            <div className="plan-item-count">
                            1日5回までの会話
                            </div>
                        </div>
                    </div>
                    <div className={`plan-item ${plan==1 ? 'active' : ""}`} onClick={()=>setPlan(1)}>
                        {/* <div className="plan-item-avatar">
                            <img src="./assets/images/job_uranaishi.png" alt=""/>
                        </div> */}
                        <div className="plan-item-wrap">
                            <div className="plan-item-sort">
                                Premium
                            </div>
                            <div className="plan-item-cost">
                                880円(月)
                            </div>
                            <div className="plan-item-count">
                                会話が無制限
                            </div>
                        </div>
                    </div>
                </div>
                
                <button onClick={handleSubmit} className="btn btn-primary" disabled={plan==originPlan}>プランを更新</button>
                </div>
            </div>
        </main>
        </>
    )
}
export default Plan;