import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'

// Layouts
import PublicLayout from './layouts/PublicLayout'
import AdminLayout from './layouts/AdminLayout'
import StudentLayout from './layouts/StudentLayout'

// Public Pages
import Home from './pages/public/Home'
import About from './pages/public/About'
import Academics from './pages/public/Academics'
import Contact from './pages/public/Contact'
import Facilities from './pages/public/Facilities'
import Notices from './pages/public/Notices'

// Auth Pages
import AdminLogin from './pages/auth/AdminLogin'
import StudentLogin from './pages/auth/StudentLogin'

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard'
import AdminStudents from './pages/admin/Students'
import AdminAttendance from './pages/admin/Attendance'
import AdminFees from './pages/admin/Fees'
import AdminResults from './pages/admin/Results'
import AdminPdfs from './pages/admin/Pdfs'

// Student Pages
import StudentDashboard from './pages/student/Dashboard'
import StudentProfile from './pages/student/Profile'
import StudentAttendance from './pages/student/Attendance'
import StudentFees from './pages/student/Fees'
import StudentResults from './pages/student/Results'
import StudentPdfs from './pages/student/Pdfs'

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/academics" element={<Academics />} />
            <Route path="/facilities" element={<Facilities />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/notices" element={<Notices />} />
          </Route>

          {/* Auth Routes */}
          <Route path="/login/admin" element={<AdminLogin />} />
          <Route path="/login/student" element={<StudentLogin />} />

          {/* Admin Routes */}
          <Route
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/students" element={<AdminStudents />} />
            <Route path="/admin/attendance" element={<AdminAttendance />} />
            <Route path="/admin/fees" element={<AdminFees />} />
            <Route path="/admin/results" element={<AdminResults />} />
            <Route path="/admin/pdfs" element={<AdminPdfs />} />
          </Route>

          {/* Student Routes */}
          <Route
            element={
              <ProtectedRoute requiredRole="student">
                <StudentLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/student/dashboard" element={<StudentDashboard />} />
            <Route path="/student/profile" element={<StudentProfile />} />
            <Route path="/student/attendance" element={<StudentAttendance />} />
            <Route path="/student/fees" element={<StudentFees />} />
            <Route path="/student/results" element={<StudentResults />} />
            <Route path="/student/pdfs" element={<StudentPdfs />} />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  )
}

export default App
