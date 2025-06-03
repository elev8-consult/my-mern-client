import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import BookingPage from './pages/BookingPage'
import AdminPage from './pages/AdminPage'
import ClassDetailsPage from './pages/ClassDetailsPage'
import ThankYouPage from './pages/ThankYouPage'
import InstructorPage from './pages/InstructorPage'
import './index.css'


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<BookingPage />} />
        <Route path="/thank-you" element={<ThankYouPage />} />
        <Route path="/aura-admin" element={<AdminPage />} />
        <Route path="/aura-admin/class/:id" element={<ClassDetailsPage />} />
        <Route path="/instructor/:instructorId" element={<InstructorPage />} />
      </Routes>
    </Router>
  )
}

export default App