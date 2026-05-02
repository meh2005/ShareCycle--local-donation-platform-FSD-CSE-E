import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import { toast } from "react-toastify";
import { Bell, MapPin, Package, Clock, LogOut, CheckCircle2, User, Mail, Phone, Camera, Edit, Save, X, Trash2, Pencil } from "lucide-react";
import { motion } from "framer-motion";

export default function UserDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const [notifications, setNotifications] = useState([]);
  const [myDonations, setMyDonations] = useState([]);
  const [myClaims, setMyClaims] = useState([]); // Requests I SENT
  const [claimsReceived, setClaimsReceived] = useState([]); // Requests I RECEIVED
  const [activeTab, setActiveTab] = useState("overview"); // overview, posts, claims, notifications
  const [loading, setLoading] = useState(true);

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: user.name,
    email: user.email,
    mobile: user.mobile,
    profilePic: user.profilePic || ""
  });
  const [uploading, setUploading] = useState(false);
  const [ratingModalOpen, setRatingModalOpen] = useState(false);
  const [selectedClaimForRating, setSelectedClaimForRating] = useState(null);
  const [ratingValue, setRatingValue] = useState(5);
  const [feedbackText, setFeedbackText] = useState("");

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await API.put("/auth/profile", editForm);
      const updatedUser = { ...user, ...res.data };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      toast.success("Profile updated successfully");
      setIsEditing(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update profile");
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file size (Base64 increases size by ~33%, so we limit to 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image too large. Please select an image under 2MB.");
      return;
    }

    setUploading(true);
    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = async () => {
        const base64String = reader.result;
        
        // Save DIRECTLY to MongoDB User collection
        const res = await API.put("/auth/profile", { ...editForm, profilePic: base64String });
        
        const updatedUser = { ...user, ...res.data };
        setUser(updatedUser);
        setEditForm({ ...editForm, profilePic: base64String });
        localStorage.setItem("user", JSON.stringify(updatedUser));
        
        toast.success("Profile picture saved directly to database!");
        setUploading(false);
      };
    } catch (err) {
      toast.error("Failed to save image to database");
      setUploading(false);
    }
  };

  const handleDeleteDonation = async (id) => {
    if (!window.confirm("Are you sure you want to remove this donation?")) return;
    try {
      await API.delete(`/donations/${id}`);
      setMyDonations(myDonations.filter(d => d._id !== id));
      toast.success("Donation removed");
    } catch (err) {
      toast.error("Failed to remove donation");
    }
  };

  const handleAcceptClaim = async (claimId) => {
    try {
      await API.put(`/claims/${claimId}/accept`);
      toast.success("Request accepted!");
      fetchDashboardData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to accept request");
    }
  };

  const handleRejectClaim = async (claimId) => {
    try {
      await API.put(`/claims/${claimId}/reject`);
      toast.success("Request declined");
      fetchDashboardData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to reject request");
    }
  };

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [notifRes, donRes, receivedRes, sentRes] = await Promise.all([
        API.get("/notifications"),
        API.get("/donations/my"),
        API.get("/claims?type=received"),
        API.get("/claims?type=sent")
      ]);
      
      setNotifications(notifRes.data);
      setMyDonations(donRes.data);
      setClaimsReceived(receivedRes.data);
      setMyClaims(sentRes.data);
      
      const profileRes = await API.get("/auth/profile").catch(() => null);
      if (profileRes) {
         const updatedUser = { ...user, ...profileRes.data };
         setUser(updatedUser);
         setEditForm({
            name: updatedUser.name,
            email: updatedUser.email,
            mobile: updatedUser.mobile,
            profilePic: updatedUser.profilePic || ""
         });
         localStorage.setItem("user", JSON.stringify(updatedUser));
      }

    } catch (error) {
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const markNotificationsRead = async () => {
    try {
      await API.put("/notifications/read");
      setNotifications(notifications.map(n => ({ ...n, isRead: true })));
    } catch (err) {
      console.log(err);
    }
  };

  const handleRatingSubmit = async () => {
    try {
      await API.post(`/claims/${selectedClaimForRating._id}/feedback`, {
        ratingGiven: ratingValue,
        feedbackText: feedbackText
      });
      toast.success("Feedback submitted!");
      setRatingModalOpen(false);
      setFeedbackText(""); // Clear for next time
      fetchDashboardData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit feedback");
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading dashboard...</div>;
  }

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col items-center">
            <div className="w-24 h-24 rounded-full bg-primary-100 flex items-center justify-center mb-4 overflow-hidden border-4 border-white shadow-sm">
              {user.profilePic ? (
                <img src={user.profilePic} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <span className="text-3xl font-bold text-primary-600">{user.name?.charAt(0)}</span>
              )}
            </div>
            <h2 className="text-xl font-bold text-gray-900 text-center">{user.name}</h2>
            <p className="text-sm text-gray-500 mb-2 truncate max-w-full">{user.email}</p>
            
            <div className="flex items-center gap-2 mb-6">
              <span className="bg-primary-50 text-primary-700 text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">
                {user.role}
              </span>
              <span className="flex items-center text-sm text-yellow-500 font-bold">
                ★ {user.rating || 0}
              </span>
            </div>

            <div className="w-full space-y-2">
              <button onClick={() => setActiveTab("overview")} className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold transition-all ${activeTab === "overview" ? "bg-slate-900 text-white shadow-md shadow-slate-200" : "text-gray-600 hover:bg-gray-50"}`}>
                Overview
              </button>
              <button onClick={() => setActiveTab("posts")} className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold transition-all ${activeTab === "posts" ? "bg-slate-900 text-white shadow-md shadow-slate-200" : "text-gray-600 hover:bg-gray-50"}`}>
                My Donations
              </button>
              <button onClick={() => setActiveTab("claims")} className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold transition-all ${activeTab === "claims" ? "bg-slate-900 text-white shadow-md shadow-slate-200" : "text-gray-600 hover:bg-gray-50"}`}>
                My Requests
              </button>
              <button onClick={() => { setActiveTab("notifications"); markNotificationsRead(); }} className={`w-full flex justify-between items-center px-4 py-3 rounded-xl text-sm font-semibold transition-all ${activeTab === "notifications" ? "bg-slate-900 text-white shadow-md shadow-slate-200" : "text-gray-600 hover:bg-gray-50"}`}>
                <span>Notifications</span>
                {unreadCount > 0 && (
                  <span className="bg-primary-500 text-white text-[10px] px-2 py-0.5 rounded-full ring-2 ring-white font-bold">{unreadCount}</span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          
          {/* Overview Tab */}
          {activeTab === "overview" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <div className="w-10 h-10 bg-green-100 text-green-600 rounded-lg flex items-center justify-center mb-4">
                    <Package className="w-5 h-5" />
                  </div>
                  <h4 className="text-gray-500 text-sm font-medium">Items Donated</h4>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{myDonations.length}</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mb-4">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <h4 className="text-gray-500 text-sm font-medium">Successful Claims</h4>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{myClaims.filter(c => c.status === "accepted").length}</p>
                </div>
              </div>

              {/* Profile Details & Edit Section */}
              <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                 {/* Identity Card */}
                 <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                    <h3 className="text-xl font-bold text-gray-900 mb-6">Personal Identity</h3>
                    
                    {isEditing ? (
                       <form onSubmit={handleProfileUpdate} className="space-y-5">
                          <div className="flex flex-col items-center mb-6">
                             <div className="relative group">
                                <div className="w-24 h-24 rounded-full bg-slate-100 overflow-hidden border-2 border-slate-200">
                                   {editForm.profilePic ? (
                                      <img src={editForm.profilePic} alt="Preview" className="w-full h-full object-cover" />
                                   ) : (
                                      <div className="w-full h-full flex items-center justify-center bg-primary-50 text-primary-600 font-bold text-2xl">
                                         {user.name?.charAt(0)}
                                      </div>
                                   )}
                                </div>
                                <label className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-full cursor-pointer">
                                   <Camera className="w-6 h-6 text-white" />
                                   <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                                </label>
                                {uploading && <div className="absolute inset-0 bg-white/60 flex items-center justify-center rounded-full"><div className="w-5 h-5 border-2 border-primary-600 border-t-transparent rounded-full animate-spin"></div></div>}
                             </div>
                             <span className="text-[10px] text-gray-400 mt-2 uppercase font-bold tracking-widest">Click to change photo</span>
                          </div>

                          <div className="space-y-4">
                             <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Full Name</label>
                                <input 
                                   type="text" 
                                   value={editForm.name} 
                                   onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                                   className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 outline-none"
                                />
                             </div>
                             <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Email Address</label>
                                <input 
                                   type="email" 
                                   value={editForm.email} 
                                   onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                                   className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 outline-none"
                                />
                             </div>
                             <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Mobile Number</label>
                                <input 
                                   type="text" 
                                   value={editForm.mobile} 
                                   onChange={(e) => setEditForm({...editForm, mobile: e.target.value})}
                                   className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 outline-none"
                                />
                             </div>
                          </div>

                          <div className="flex gap-3 pt-4">
                             <button 
                                type="button"
                                onClick={() => setIsEditing(false)}
                                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3 rounded-xl text-sm transition-colors"
                             >
                                Cancel
                             </button>
                             <button 
                                type="submit"
                                className="flex-1 bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 rounded-xl text-sm shadow-md shadow-primary-200 transition-all active:scale-[0.98]"
                             >
                                Save Changes
                             </button>
                          </div>
                       </form>
                    ) : (
                       <div className="space-y-6">
                          <div className="flex flex-col items-center mb-4">
                             <div className="w-20 h-20 rounded-full bg-primary-100 flex items-center justify-center overflow-hidden border-4 border-white shadow-sm">
                                {user.profilePic ? (
                                   <img src={user.profilePic} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                   <span className="text-2xl font-bold text-primary-600">{user.name?.charAt(0)}</span>
                                )}
                             </div>
                          </div>

                          <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                             <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-primary-600 shadow-sm">
                                <User className="w-6 h-6" />
                             </div>
                             <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Display Name</p>
                                <p className="font-bold text-slate-800">{user.name}</p>
                             </div>
                          </div>

                          <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                             <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-primary-600 shadow-sm">
                                <Mail className="w-6 h-6" />
                             </div>
                             <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Email Verified</p>
                                <p className="font-bold text-slate-800">{user.email}</p>
                             </div>
                          </div>

                          <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                             <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-primary-600 shadow-sm">
                                <Phone className="w-6 h-6" />
                             </div>
                             <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Mobile Contact</p>
                                <p className="font-bold text-slate-800">{user.mobile}</p>
                             </div>
                          </div>
                       </div>
                    )}
                 </div>

                 {/* Edit Profile Action Card */}
                 {!isEditing && (
                    <div className="bg-slate-900 p-8 rounded-3xl shadow-xl shadow-slate-200 text-white flex flex-col justify-center items-center text-center relative overflow-hidden">
                       <div className="relative z-10">
                          <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-6 mx-auto backdrop-blur-sm border border-white/20">
                             <Edit className="w-8 h-8 text-primary-400" />
                          </div>
                          <h4 className="text-2xl font-bold mb-3">Update Profile</h4>
                          <p className="text-slate-400 text-sm mb-8 leading-relaxed">Keep your information up to date so others can reach you easily.</p>
                          <button 
                             onClick={() => setIsEditing(true)}
                             className="w-full bg-primary-600 hover:bg-primary-700 text-white py-4 rounded-2xl font-bold transition-all transform active:scale-[0.98] shadow-lg shadow-primary-900/40"
                          >
                             Edit My Details
                          </button>
                       </div>
                       <div className="absolute top-0 right-0 w-32 h-32 bg-primary-600/20 rounded-full blur-3xl"></div>
                       <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-600/10 rounded-full blur-3xl"></div>
                    </div>
                 )}
              </div>
            </motion.div>
          )}

          {/* Notifications Tab */}
          {activeTab === "notifications" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h3 className="text-lg font-bold text-gray-900">Notifications</h3>
              </div>
              <div className="divide-y divide-gray-50">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">No notifications yet.</div>
                ) : (
                  notifications.map((notif) => (
                    <div key={notif._id} className={`p-4 flex gap-4 ${!notif.isRead ? 'bg-blue-50/50' : ''}`}>
                      <div className="mt-1">
                        <div className="w-8 h-8 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center">
                          <Bell className="w-4 h-4" />
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-800">{notif.message}</p>
                        <p className="text-xs text-gray-500 mt-1">{new Date(notif.createdAt).toLocaleString()}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          )}

          {/* Posts Tab (My Donations) */}
          {activeTab === "posts" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Manage Your Posts</h2>
              {myDonations.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-200">
                  <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">You haven't posted anything yet.</p>
                  <Link to="/create" className="text-primary-600 font-bold mt-2 inline-block">Create your first post</Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {myDonations.map(don => (
                    <div key={don._id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                      <div className="flex gap-4">
                        <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                          {don.images?.[0] ? <img src={don.images[0]} className="w-full h-full object-cover" /> : <Package className="w-full h-full p-4 text-gray-300" />}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-900 line-clamp-1">{don.title}</h4>
                          <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase mt-1 ${don.status === 'available' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>{don.status}</span>
                          <div className="flex gap-2 mt-4">
                            <button onClick={() => navigate(`/edit/${don._id}`)} className="p-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100"><Pencil className="w-4 h-4" /></button>
                            <button onClick={() => handleDeleteDonation(don._id)} className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100"><Trash2 className="w-4 h-4" /></button>
                          </div>
                        </div>
                      </div>
                      
                      {/* Received Requests for this specific post */}
                      <div className="mt-4 pt-4 border-t border-gray-50">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Requests for this item</p>
                        {claimsReceived.filter(c => c.donation?._id === don._id).length > 0 ? (
                          <div className="space-y-2">
                            {claimsReceived.filter(c => c.donation?._id === don._id).map(c => (
                              <div key={c._id} className="flex items-center justify-between bg-slate-50 p-3 rounded-xl">
                                <div className="flex items-center gap-2">
                                  <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-[10px] font-bold overflow-hidden">
                                    {c.requester?.profilePic ? <img src={c.requester.profilePic} /> : c.requester?.name?.[0]}
                                  </div>
                                  <div>
                                    <p className="text-xs font-bold text-gray-800">{c.requester?.name}</p>
                                    <p className="text-[10px] text-gray-500">Qty: {c.quantityRequested}</p>
                                  </div>
                                </div>
                                <div className="flex gap-1">
                                  {c.status === "pending" ? (
                                    <>
                                      <button onClick={() => handleAcceptClaim(c._id)} className="px-2 py-1 bg-green-500 text-white rounded text-[10px] font-bold">Accept</button>
                                      <button onClick={() => handleRejectClaim(c._id)} className="px-2 py-1 bg-red-500 text-white rounded text-[10px] font-bold">Reject</button>
                                    </>
                                  ) : (
                                    <span className={`text-[10px] font-bold uppercase ${c.status === 'accepted' ? 'text-green-600' : 'text-red-600'}`}>{c.status}</span>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-xs text-gray-400 italic">No requests yet</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* Claims Tab (My Requests) */}
          {activeTab === "claims" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Your Requests</h2>
              {myClaims.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-200">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Package className="w-6 h-6 text-gray-400" />
                  </div>
                  <p className="text-gray-500">You haven't requested anything yet.</p>
                  <Link to="/feed" className="text-primary-600 font-bold mt-2 inline-block">Explore items</Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {myClaims.map(claim => (
                    <div key={claim._id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                      <div className="flex gap-4">
                        <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                          {claim.donation?.images?.[0] ? <img src={claim.donation.images[0]} className="w-full h-full object-cover" /> : <Package className="w-full h-full p-4 text-gray-300" />}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-900 line-clamp-1">{claim.donation?.title || "Deleted Item"}</h4>
                          <p className="text-xs text-gray-500">Qty Requested: {claim.quantityRequested}</p>
                          <div className="flex justify-between items-center mt-3">
                             <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                               claim.status === 'accepted' ? 'bg-green-100 text-green-700' : 
                               claim.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                             }`}>
                               {claim.status}
                             </span>
                             {claim.status === "accepted" && (
                               <div className="mt-2 space-y-2">
                                  <p className="text-[10px] text-gray-400">Contact: {claim.donation?.contact || "Available on collect"}</p>
                                  {!claim.ratingGiven ? (
                                    <button 
                                      onClick={() => {
                                        setSelectedClaimForRating(claim);
                                        setRatingModalOpen(true);
                                      }}
                                      className="text-[10px] font-bold text-primary-600 hover:underline"
                                    >
                                      Rate Donor
                                    </button>
                                  ) : (
                                    <div className="flex items-center gap-1 text-[10px] text-yellow-500 font-bold">
                                      ★ Rated {claim.ratingGiven}/5
                                    </div>
                                  )}
                               </div>
                             )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

        </div>
      </div>

      {/* Rating Modal */}
      {ratingModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[150] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 text-center">Rate Your Experience</h3>
            <div className="flex justify-center gap-2 mb-6">
              {[1, 2, 3, 4, 5].map(star => (
                <button 
                  key={star} 
                  onClick={() => setRatingValue(star)}
                  className={`text-3xl transition-transform active:scale-90 ${star <= ratingValue ? 'text-yellow-500' : 'text-gray-300'}`}
                >
                  ★
                </button>
              ))}
            </div>
            <textarea 
              placeholder="Tell others how it went..."
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm mb-4 focus:ring-2 focus:ring-primary-500 outline-none min-h-[100px]"
            />
            <div className="flex gap-3">
              <button onClick={() => setRatingModalOpen(false)} className="flex-1 py-2 text-sm font-bold text-gray-500 hover:bg-gray-50 rounded-xl transition-colors">Cancel</button>
              <button onClick={handleRatingSubmit} className="flex-1 bg-primary-600 text-white py-3 rounded-xl text-sm font-bold shadow-md hover:bg-primary-700 transition-all">Submit Feedback</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
