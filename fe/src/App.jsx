import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/layout/Navbar';
import PrivateRoute from './components/auth/PrivateRoute';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import HomePage from './pages/home/HomePage';
import ProfilePage from './pages/profile/ProfilePage';
import CoursesPage from './pages/courses/CoursesPage';
import CourseDetailPage from './pages/courses/CourseDetailPage';
import MyCoursesPage from './pages/courses/MyCoursesPage';
import LectureDetailPage from './pages/lectures/LectureDetailPage';
import InstructorDashboardPage from './pages/instructor/InstructorDashboardPage';
import CreateCoursePage from './pages/instructor/CreateCoursePage';
import EditCoursePage from './pages/instructor/EditCoursePage';
import ManageLecturesPage from './pages/instructor/ManageLecturesPage';
import CreateLecturePage from './pages/instructor/CreateLecturePage';
import EditLecturePage from './pages/instructor/EditLecturePage';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-[--color-bg-dark]">
          <Navbar />
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Protected Routes */}
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <HomePage />
                </PrivateRoute>
              }
            />
            <Route
              path="/courses"
              element={
                <PrivateRoute>
                  <CoursesPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/my-courses"
              element={
                <PrivateRoute>
                  <MyCoursesPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/courses/:courseId"
              element={
                <PrivateRoute>
                  <CourseDetailPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/courses/:courseId/lectures/:lectureId"
              element={
                <PrivateRoute>
                  <LectureDetailPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <ProfilePage />
                </PrivateRoute>
              }
            />
            <Route
              path="/instructor/dashboard"
              element={
                <PrivateRoute>
                  <InstructorDashboardPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/instructor/courses/create"
              element={
                <PrivateRoute>
                  <CreateCoursePage />
                </PrivateRoute>
              }
            />
            <Route
              path="/instructor/courses/:courseId/edit"
              element={
                <PrivateRoute>
                  <EditCoursePage />
                </PrivateRoute>
              }
            />
            <Route
              path="/instructor/courses/:courseId/lectures"
              element={
                <PrivateRoute>
                  <ManageLecturesPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/instructor/courses/:courseId/lectures/create"
              element={
                <PrivateRoute>
                  <CreateLecturePage />
                </PrivateRoute>
              }
            />
            <Route
              path="/instructor/courses/:courseId/lectures/:lectureId/edit"
              element={
                <PrivateRoute>
                  <EditLecturePage />
                </PrivateRoute>
              }
            />

            {/* Catch all - redirect to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
