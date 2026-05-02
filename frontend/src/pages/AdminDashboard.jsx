import { useState, useEffect } from "react";
import API from "../services/api";
import { toast } from "react-toastify";
import { Users, Package, AlertTriangle, CheckCircle, Trash2, Shield } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [donations, setDonations] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [safetyBuffer, setSafetyBuffer] = useState(66.6);

  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || user.role !== "admin") {
      toast.error("Unauthorized access");
      navigate("/admin-login");
      return;
    }
    fetchData();
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
     try {
        const res = await API.get("/admin/config");
        const buffer = res.data.find(c => c.key === "foodSafetyBuffer");
        if (buffer) setSafetyBuffer(buffer.value);
     } catch (err) {
        console.error("Config fetch error");
     }
  };

  const updateConfig = async (val) => {
     try {
        await API.post("/admin/config", { key: "foodSafetyBuffer", value: val });
        setSafetyBuffer(val);
        fetchData(); // Refresh list
     } catch (err) {
        toast.error("Failed to update safety buffer");
     }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      // Re-check token presence
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user?.token) throw new Error("No token found");

      const [statsRes, usersRes, donationsRes] = await Promise.all([
        API.get("/admin/stats"),
        API.get("/admin/users"),
        API.get("/admin/donations")
      ]);
      setStats(statsRes.data);
      setUsers(usersRes.data);
      setDonations(donationsRes.data);
    } catch (err) {
      console.error("Admin fetch error:", err);
      toast.error(err.response?.data?.message || "Failed to fetch admin data");
      if (err.response?.status === 401) {
         // If we get a 401, the token might be expired
         // localStorage.removeItem("user");
         // navigate("/admin-login");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await API.delete(`/admin/users/${id}`);
      setUsers(users.filter(u => u._id !== id));
      toast.success("User deleted");
    } catch (err) {
      toast.error("Failed to delete user");
    }
  };

  const handleDeleteDonation = async (id) => {
    if (!window.confirm("Are you sure you want to delete this donation?")) return;
    try {
      await API.delete(`/admin/donations/${id}`);
      setDonations(donations.filter(d => d._id !== id));
      toast.success("Donation deleted");
    } catch (err) {
      toast.error("Failed to delete donation");
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading admin panel...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 bg-slate-900 text-white rounded-xl flex items-center justify-center">
          <Shield className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Control Panel</h1>
          <p className="text-gray-500 text-sm">Manage users, monitor activity, and moderate content.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-2">
          <button onClick={() => setActiveTab("overview")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${activeTab === "overview" ? "bg-slate-900 text-white" : "text-gray-600 hover:bg-gray-100"}`}>
            Overview
          </button>
          <button onClick={() => setActiveTab("users")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${activeTab === "users" ? "bg-slate-900 text-white" : "text-gray-600 hover:bg-gray-100"}`}>
            Manage Users
          </button>
          <button onClick={() => setActiveTab("donations")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${activeTab === "donations" ? "bg-slate-900 text-white" : "text-gray-600 hover:bg-gray-100"}`}>
            Manage Posts
          </button>
        </div>

        {/* Content */}
        <div className="lg:col-span-4">
          
          {activeTab === "overview" && stats && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Users</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalUsers}</p>
                </div>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                <div className="w-14 h-14 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center">
                  <Package className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Donations</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalDonations}</p>
                </div>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                <div className="w-14 h-14 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Claims</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalClaims}</p>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "users" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-lg font-bold text-gray-900">User Management</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-500">
                  <thead className="bg-gray-50 text-gray-700 uppercase">
                    <tr>
                      <th className="px-6 py-4">User</th>
                      <th className="px-6 py-4">Email</th>
                      <th className="px-6 py-4">Role</th>
                      <th className="px-6 py-4">Rating</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(u => (
                      <tr key={u._id} className="border-b border-gray-50">
                        <td className="px-6 py-4">
                           <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center overflow-hidden border border-gray-200">
                                 {u.profilePic ? (
                                    <img src={u.profilePic} alt="" className="w-full h-full object-cover" />
                                 ) : (
                                    <span className="text-xs font-bold text-primary-600 uppercase">{u.name?.charAt(0)}</span>
                                 )}
                              </div>
                              <span className="font-medium text-gray-900">{u.name}</span>
                           </div>
                        </td>
                        <td className="px-6 py-4">{u.email}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${u.role === 'admin' ? 'bg-red-100 text-red-700' : u.role === 'organization' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="px-6 py-4">★ {u.rating}</td>
                        <td className="px-6 py-4 text-right">
                          {u.role !== 'admin' && (
                            <button onClick={() => handleDeleteUser(u._id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {activeTab === "donations" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                   <h2 className="text-lg font-bold text-gray-900">Content Moderation</h2>
                   <p className="text-xs text-gray-500">Manage listings and adjust safety thresholds.</p>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center gap-3">
                   <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Safety Buffer (%)</span>
                      <span className="text-[9px] text-slate-400">Hides food after this % of lifetime</span>
                   </div>
                   <div className="flex items-center gap-2">
                      <input 
                         type="number" 
                         min="10" 
                         max="100" 
                         value={safetyBuffer} 
                         onChange={(e) => setSafetyBuffer(e.target.value)}
                         className="w-16 bg-white border border-slate-200 rounded-lg px-2 py-1 text-sm font-bold text-primary-600 focus:ring-1 focus:ring-primary-500 outline-none"
                      />
                      <button 
                         onClick={() => updateConfig(safetyBuffer)}
                         className="bg-primary-600 hover:bg-primary-700 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg transition-colors"
                      >
                         Apply
                      </button>
                   </div>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-widest">Listing Details</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-widest">Category</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-widest">Method</th>
                      <th className="px-6 py-4 text-center text-xs font-bold text-slate-500 uppercase tracking-widest">Posted</th>
                      <th className="px-6 py-4 text-center text-xs font-bold text-slate-500 uppercase tracking-widest">Claimed</th>
                      <th className="px-6 py-4 text-center text-xs font-bold text-slate-500 uppercase tracking-widest">Available</th>
                      <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-widest">Control</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {donations.map(d => {
                      const category = (d.category || "").toLowerCase();
                      const now = new Date().getTime();
                      const isExpired = category === 'food' && d.expiresAt && new Date(d.expiresAt).getTime() < now;
                      
                      let isStale = false;
                      if (category === 'food' && d.cookedAt && d.expiresAt) {
                         const cooked = new Date(d.cookedAt).getTime();
                         const expires = new Date(d.expiresAt).getTime();
                         const threshold = cooked + ((expires - cooked) * 2) / 3;
                         isStale = now > threshold;
                      }

                      const isFullyClaimed = (d.quantityAvailable ?? 1) <= 0;
                      
                      return (
                        <tr key={d._id} className={`hover:bg-slate-50/50 transition-colors ${isExpired || isStale ? 'bg-red-100/60' : ''}`}>
                          <td className="px-6 py-5">
                             <div className="flex flex-col">
                                <div className="flex items-center gap-2">
                                   <span className="font-bold text-slate-900 line-clamp-1 text-sm">{d.title}</span>
                                   {isExpired && <span className="px-1.5 py-0.5 bg-red-600 text-white text-[9px] font-black rounded uppercase shadow-sm">Expired</span>}
                                   {!isExpired && isStale && <span className="px-1.5 py-0.5 bg-orange-600 text-white text-[9px] font-black rounded uppercase shadow-sm">Stale (2/3)</span>}
                                   {category === 'food' && !d.expiresAt && <span className="px-1.5 py-0.5 bg-amber-500 text-white text-[9px] font-black rounded uppercase">No Expiry</span>}
                                   {isFullyClaimed && !isExpired && <span className="px-1.5 py-0.5 bg-slate-600 text-white text-[9px] font-black rounded uppercase">Claimed</span>}
                                </div>
                                <span className="text-xs text-slate-400 mt-0.5">by {d.user?.name || "Unknown User"}</span>
                             </div>
                          </td>
                          <td className="px-6 py-5">
                             <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200 uppercase tracking-wider">
                                {d.category || 'General'}
                             </span>
                          </td>
                          <td className="px-6 py-5">
                             <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-tighter border ${
                                d.transactionType === 'donate' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 
                                d.transactionType === 'resale' ? 'bg-sky-50 text-sky-700 border-sky-100' : 
                                'bg-violet-50 text-violet-700 border-violet-100'
                             }`}>
                                {d.transactionType === 'donate' ? 'Donation' : d.transactionType === 'resale' ? 'Resale' : 'Exchange'}
                             </span>
                          </td>
                          <td className="px-6 py-5 text-center font-mono text-sm text-slate-600">{d.quantityValue || d.quantity || 1}</td>
                          <td className="px-6 py-5 text-center font-mono text-sm text-sky-600 font-bold">
                             {(d.quantityValue || d.quantity || 1) - (d.quantityAvailable ?? (d.quantityValue || d.quantity || 1))}
                          </td>
                          <td className="px-6 py-5 text-center font-mono text-sm text-emerald-600 font-black">
                             {d.quantityAvailable ?? (d.quantityValue || d.quantity || 1)}
                          </td>
                          <td className="px-6 py-5 text-right">
                            <button 
                               onClick={() => handleDeleteDonation(d._id)} 
                               className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                               title="Remove Listing"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

        </div>
      </div>
    </div>
  );
}
