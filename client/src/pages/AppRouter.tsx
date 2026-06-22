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
                <Route path="/student" element={<div>Student Page</div>} />
                <Route path="/teacher" element={<div>Teacher Page</div>} />
            </Routes>
        </BrowserRouter>
    );
};

export default AppRouter;
