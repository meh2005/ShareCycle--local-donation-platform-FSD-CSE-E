import { useEffect, useState } from "react";
import API from "../services/api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import DonationCard from "../components/DonationCard";
import { Search, Filter, X, Building2, TrendingUp, Handshake } from "lucide-react";
import { motion } from "framer-motion";

function OrganizationHub() {
  const [donations, setDonations] = useState([]);
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({ transactionType: "", category: "", location: "" });
  const [claimModalOpen, setClaimModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const fetchOrgDonations = async () => {
    setLoading(true);
    try {
      let query = "role=organization&";
      if (filters.transactionType) query += `transactionType=${filters.transactionType}&`;
      if (filters.category) query += `category=${filters.category}&`;
      if (filters.location) query += `location=${filters.location}`;

      const res = await API.get(`/donations?${query}`);
      setDonations(res.data);
    } catch (err) {
      toast.error("Error fetching organization listings");
    }
    setLoading(false);
  };

  const fetchClaims = async () => {
    if (!user) return;
    try {
      const res = await API.get("/claims");
      setClaims(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchOrgDonations();
    fetchClaims();
  }, [filters]);

  const openClaimModal = (item) => {
    if (!user) {
      toast.error("Please login to participate");
      navigate("/login");
      return;
    }
    
    // Org-to-Org Resale Restriction Check
    if (item.transactionType === "resale" && user.role !== "organization") {
       toast.error("This resale item is exclusively for Organizations/NGOs.");
       return;
    }

    setSelectedItem(item);
    setQuantity(1);
    setClaimModalOpen(true);
  };

  const handleClaimSubmit = async () => {
    try {
      await API.post("/claims", { 
        donationId: selectedItem._id, 
        quantityRequested: quantity 
      });
      toast.success("Request sent successfully!");
      setClaimModalOpen(false);
      fetchOrgDonations();
      fetchClaims();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error submitting claim");
    }
  };

  const handleAccept = async (claimId) => {
    try {
      await API.put(`/claims/${claimId}/accept`);
      toast.success("Accepted request");
      fetchOrgDonations();
      fetchClaims();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error");
    }
  };

  const handleReject = async (claimId) => {
    try {
      await API.put(`/claims/${claimId}/reject`);
      toast.error("Rejected request");
      fetchOrgDonations();
      fetchClaims();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error");
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-12">
      {/* Org Hero */}
      <div className="bg-blue-900 text-white py-16 px-4 mb-8 relative overflow-hidden">
        <div className="max-w-6xl mx-auto relative z-10 text-center">
          <div className="inline-flex items-center gap-2 bg-blue-800/50 px-4 py-1.5 rounded-full text-blue-200 text-sm font-bold mb-6 backdrop-blur-sm border border-blue-700">
             <Building2 className="w-4 h-4" /> B2B Organization Hub
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">Organization Collaboration</h1>
          <p className="text-blue-200 text-lg max-w-2xl mx-auto">Connect with other NGOs and verified organizations. Share excess inventory or source items at organization-exclusive rates.</p>
        </div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl -mr-48 -mt-48"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl -ml-48 -mb-48"></div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        


        {/* Filters Bar */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-8 flex flex-col md:flex-row gap-4 items-center">
          <div className="flex-1 flex w-full gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search location..."
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                value={filters.location}
                onChange={(e) => setFilters({ ...filters, location: e.target.value })}
              />
            </div>
            
            <select
              className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={filters.transactionType}
              onChange={(e) => setFilters({ ...filters, transactionType: e.target.value })}
            >
              <option value="">All Types</option>
              <option value="donate">Free for Orgs</option>
              <option value="resale">Org Resale</option>
            </select>

            <select
              className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value })}
            >
              <option value="">All Categories</option>
              <option value="food">Food</option>
              <option value="clothes">Clothes</option>
              <option value="medical">Medical</option>
              <option value="education">Education</option>
            </select>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => setFilters({ transactionType: "", category: "", location: "" })}
              className="flex items-center gap-2 text-gray-500 hover:text-gray-900 px-4 py-2 rounded-xl hover:bg-gray-100 transition-colors whitespace-nowrap"
            >
              <Filter className="w-4 h-4" /> Clear
            </button>
          </div>
        </div>

        {/* Loading / Empty States */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        )}

        {!loading && donations.length === 0 && (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Building2 className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">No organization listings</h3>
            <p className="text-gray-500 mt-1">Check back later for B2B sharing opportunities.</p>
          </div>
        )}

        {/* Grid View */}
        {!loading && donations.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {donations.map((item) => {
              const itemClaims = claims.filter(c => c.donation?._id === item._id && c.status === "pending");
              return (
                <DonationCard 
                  key={item._id} 
                  item={item} 
                  currentUser={user}
                  itemClaims={itemClaims}
                  onClaim={openClaimModal}
                  onAccept={handleAccept}
                  onReject={handleReject}
                />
              );
            })}
          </div>
        )}
      </div>

      {/* Claim Modal */}
      {claimModalOpen && selectedItem && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-blue-50">
              <h3 className="text-xl font-bold text-blue-900">Org-to-Org Request</h3>
              <button onClick={() => setClaimModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6">
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-1">{selectedItem.title}</h4>
                <p className="text-sm text-gray-500">Listed by: {selectedItem.user?.name}</p>
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Quantity to Request</label>
                <div className="flex items-center gap-4">
                  <input 
                    type="number" 
                    min="1" 
                    max={selectedItem.quantityAvailable} 
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value))}
                    className="w-24 border border-gray-300 rounded-lg px-3 py-2 text-center focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                  <span className="text-gray-500">{selectedItem.quantityUnit}</span>
                </div>
              </div>

              {selectedItem.transactionType === "resale" && (
                <div className="mb-6 p-4 bg-yellow-50 text-yellow-800 rounded-xl text-sm border border-yellow-100">
                  <p className="font-semibold mb-1">B2B Transaction</p>
                  <p>You are about to purchase this excess inventory at the listed price of ₹{selectedItem.resalePrice}.</p>
                </div>
              )}

              <div className="flex gap-3">
                <button 
                  onClick={() => setClaimModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleClaimSubmit}
                  className="flex-1 py-2.5 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-sm"
                >
                  Confirm B2B Request
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default OrganizationHub;
