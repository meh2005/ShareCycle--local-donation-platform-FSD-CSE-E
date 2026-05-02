import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { toast } from "react-toastify";
import { ShieldAlert, Lock, User } from "lucide-react";

export default function AdminLogin() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Re-using the same login endpoint but with name mapping
      const res = await API.post("/auth/login", { 
         email: form.username, // Our backend now checks name field too
         password: form.password 
      });
      
      if (res.data.role !== "admin") {
         toast.error("Unauthorized: Not an admin account");
         setLoading(false);
         return;
      }

      localStorage.setItem("user", JSON.stringify(res.data));
      toast.success("Admin Access Granted");
      navigate("/admin"); // Go to admin panel
    } catch (err) {
      toast.error(err.response?.data?.message || "Admin login failed");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 font-sans">
      <div className="max-w-md w-full">
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-primary-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-primary-500/20">
            <ShieldAlert className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Restricted Access</h1>
          <p className="text-slate-400 mt-2">Enter credentials to access the command center</p>
        </div>

        <div className="bg-slate-800 rounded-3xl p-8 border border-slate-700 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Username</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type="text"
                  required
                  placeholder="admin"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 pl-12 pr-4 text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                  value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Security Key</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 pl-12 pr-4 text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-600 hover:bg-primary-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-primary-600/20 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>Authorize Access</>
              )}
            </button>
          </form>
        </div>
        
        <p className="text-center mt-8">
          <button onClick={() => navigate("/")} className="text-slate-500 hover:text-white text-sm font-medium transition-colors">
            ← Return to Public Terminal
          </button>
        </p>
      </div>
    </div>
  );
}
