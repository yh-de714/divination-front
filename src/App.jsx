import './assets/css/styles.css'
import AppRoot from './AppRoot.jsx';
import {Elements} from '@stripe/react-stripe-js';
import {loadStripe} from "@stripe/stripe-js/pure";

// const stripePromise = loadStripe('pk_test_51MnbnGHAKhp7glCMcAgv2vzmo1YyLBDrCg1De4gLZVjPBL09QY0tb8HHF1upUGH6urcNSGaAaQ3oTF1jM6gyJyi100aNbUOdRi');
const stripePromise = loadStripe('pk_live_51MoKNUFd0IMPd3rDSmADUORinDSdlVG5qlyft05NRdKHtIP695BDMR60cFsyOz9AT3ae9Pe1J1oTPABse1TJUEVo00o7ac1U9g');
function App() {
  return (
    <Elements stripe={stripePromise}>
      <AppRoot /> 
    </Elements>
  )
}

export default App
