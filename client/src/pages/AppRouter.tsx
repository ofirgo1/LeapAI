import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './Login/Login';
import SignIn from './SignIn/SignIn';
import Teacher from './Teacher/Teacher';
import Student from './Student/Student';
import TeacherContents from './TeacherContents/TeacherContents';
import TeacherContentView from './TeacherContantView/TeacherContantView';
import TeacherCreateContent from './TeacherCreateContant/TeacherCreateContant';
import Quiz from './Quiz/Quiz';

const AppRouter = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signin" element={<SignIn />} />
                <Route path="/student" element={<Student />} />
                <Route path="/teacher" element={<TeacherContents />} />
                <Route path="/teacher/contents" element={<TeacherContents />} />
                <Route
                    path="/teacher/contents/:id"
                    element={<TeacherContentView />}
                />
                <Route path="/teacher/quiz/:id" element={<Quiz />} />
                <Route
                    path="/teacher/createContent"
                    element={<TeacherCreateContent />}
                />
            </Routes>
        </BrowserRouter>
    );
};

export default AppRouter;
