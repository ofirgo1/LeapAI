import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './Login/Login';
import SignIn from './SignIn/SignIn';

const AppRouter = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<div>Home</div>} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signin" element={<SignIn />} />
                <Route path="/dashboard" element={<div>Dashboard</div>} />
            </Routes>
        </BrowserRouter>
    );
};

export default AppRouter;
