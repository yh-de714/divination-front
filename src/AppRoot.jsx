import {BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import TopPage from './pages/TopPage.jsx';
import Start from './pages/Start.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Process from './pages/Process.jsx';
import Info from './pages/Info.jsx';
import Profile from './pages/Profile.jsx';
import Plan from './pages/Plan.jsx';

function AppRoot() {
    var userData =  JSON.parse(localStorage.getItem("userData")) || null;
    return(
        <Router>
            <Routes>
                <Route path="/" element={<TopPage />} />
                <Route path="/start" element={<Start />} />
                <Route path='/login'  element={userData ? <Navigate to="/start" replace /> : <Login />}/>
                <Route path='/register'  element={userData ? <Navigate to="/start" replace /> : <Register />}/>
                <Route path="/info" element={<Info />} />
                <Route path="/process" element={<Process />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/plan" element={<Plan />} />
            </Routes>
        </Router>
    )
}

export default AppRoot;