import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Bell, User, LogOut, Settings, Building2 } from "lucide-react";

export default function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("user");
    toast.success("Logged out successfully");
    navigate("/");
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to={user?.role === "admin" ? "/admin" : (user ? "/feed" : "/")} className="flex-shrink-0 flex items-center gap-2">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">S</span>
              </div>
              <span className="font-bold text-xl text-slate-800 tracking-tight">ShareCycle ♻️</span>
            </Link>
            
            {user && user.role !== "admin" && (
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link to="/feed" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  Feed
                </Link>
              </div>
            )}
          </div>

          <div className="flex items-center gap-4">
            {!user ? (
              <>
                <div className="hidden md:flex items-center space-x-6">
                  <Link to="/feed" className="text-gray-600 hover:text-slate-900 font-medium transition-colors">Feed</Link>
                  <Link to="/org-hub" className="text-blue-600 hover:text-blue-700 font-bold transition-colors flex items-center gap-1">
                     <Building2 className="w-4 h-4" /> Org Hub
                  </Link>
                  <Link to="/login" className="bg-slate-900 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-slate-800 transition-all shadow-sm active:scale-95">Login</Link>
                </div>
              </>
            ) : (
              <>
                {user.role !== "admin" && (
                  <>
                    <Link to="/create" className="hidden sm:block bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm">
                      + Donate
                    </Link>
                    
                    <Link to="/dashboard" className="flex items-center justify-center w-8 h-8 rounded-full bg-primary-100 overflow-hidden border-2 border-white shadow-sm hover:ring-2 hover:ring-primary-500 transition-all">
                      {user.profilePic ? (
                        <img src={user.profilePic} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-sm font-bold text-primary-600">{user.name?.charAt(0)}</span>
                      )}
                    </Link>
                  </>
                )}
                
                {user.role === "admin" && (
                  <Link to="/admin" className="text-gray-500 hover:text-primary-600 flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors">
                    <Settings className="w-5 h-5" />
                    <span className="text-sm font-bold">Control Panel</span>
                  </Link>
                )}

                <button onClick={handleLogout} className="text-gray-500 hover:text-red-600 p-1 rounded-full hover:bg-gray-100 transition-colors">
                  <LogOut className="w-5 h-5" />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
