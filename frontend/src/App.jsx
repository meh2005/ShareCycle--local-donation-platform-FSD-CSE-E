import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import AdminLogin from "./pages/AdminLogin";
import Organizations from "./pages/Organizations";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CreateDonation from "./pages/CreateDonation";
import ResetPassword from "./pages/ResetPassword";
import OrganizationHub from "./pages/OrganizationHub";

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col font-sans">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/feed" element={<Dashboard />} />
            <Route path="/dashboard" element={<UserDashboard />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="/organizations" element={<Organizations />} />
            <Route path="/org-hub" element={<OrganizationHub />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/create" element={<CreateDonation />} />
            <Route path="/edit/:id" element={<CreateDonation />} />
            <Route path="/reset" element={<ResetPassword />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;