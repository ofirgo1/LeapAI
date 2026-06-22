import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './Login/Login';
import SignIn from './SignIn/SignIn';
import Teacher from './Teacher/Teacher';
import Student from './Student/Student';
import TeacherContents from './TeacherContents/TeacherContents';
import TeacherContentView from './TeacherContantView/TeacherContantView';
import TeacherCreateContent from './TeacherCreateContant/TeacherCreateContant';
import StudentContentView from './Student/StudentContantView/StudentContantView';
import StudentContents from './Student/StudentsContants/StudentContants';

const AppRouter = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<div>Home</div>} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signin" element={<SignIn />} />
                <Route path="/student" element={<Student />} />
                <Route path="/student/contents" element={<StudentContents />} />
                <Route
                    path="/student/contents/:id"
                    element={<StudentContentView />}
                />
                <Route path="/teacher" element={<Teacher />} />
                <Route path="/teacher/contents" element={<TeacherContents />} />
                <Route
                    path="/teacher/contents/:id"
                    element={<TeacherContentView />}
                />
                <Route
                    path="/teacher/createContent"
                    element={<TeacherCreateContent />}
                />
            </Routes>
        </BrowserRouter>
    );
};

export default AppRouter;
