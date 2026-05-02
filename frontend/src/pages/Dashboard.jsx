import { useEffect, useState } from "react";
import API from "../services/api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import DonationCard from "../components/DonationCard";
import { Search, Filter, X, Grid, Package } from "lucide-react";

function Dashboard() {
  const [donations, setDonations] = useState([]);
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({ transactionType: "", category: "", location: "" });
  const [claimModalOpen, setClaimModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const fetchDonations = async () => {
    setLoading(true);
    try {
      let query = "";
      if (filters.transactionType) query += `transactionType=${filters.transactionType}&`;
      if (filters.category) query += `category=${filters.category}&`;
      if (filters.location) query += `location=${filters.location}`;

      const res = await API.get(`/donations?${query}`);
      setDonations(res.data);
    } catch (err) {
      toast.error("Error fetching donations");
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
    fetchDonations();
    fetchClaims();
  }, [filters]);

  const openClaimModal = (item) => {
    if (!user) {
      toast.error("Please login to claim");
      navigate("/login");
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
      fetchDonations();
      fetchClaims();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error submitting claim");
    }
  };

  const handleAccept = async (claimId) => {
    try {
      await API.put(`/claims/${claimId}/accept`);
      toast.success("Accepted request");
      fetchDonations();
      fetchClaims();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error");
    }
  };

  const handleReject = async (claimId) => {
    try {
      await API.put(`/claims/${claimId}/reject`);
      toast.error("Rejected request");
      fetchDonations();
      fetchClaims();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error");
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-12">
      {/* Hero Section */}
      <div className="bg-primary-600 text-white py-16 px-4 mb-8">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">Discover & Share</h1>
          <p className="text-primary-100 text-lg max-w-2xl mx-auto">Find items you need or give away what you don't. Build a better community together.</p>
        </div>
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
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:outline-none"
                value={filters.location}
                onChange={(e) => setFilters({ ...filters, location: e.target.value })}
              />
            </div>
            
            <select
              className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:outline-none"
              value={filters.transactionType}
              onChange={(e) => setFilters({ ...filters, transactionType: e.target.value })}
            >
              <option value="">All Types</option>
              <option value="donate">Donate</option>
              <option value="resale">Resale</option>
              <option value="exchange">Exchange</option>
            </select>

            <select
              className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:outline-none"
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value })}
            >
              <option value="">All Categories</option>
              <option value="food">Food</option>
              <option value="clothes">Clothes</option>
              <option value="furniture">Furniture</option>
              <option value="toys">Toys</option>
              <option value="household">Household</option>
              <option value="other">Other</option>
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
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        )}

        {!loading && donations.length === 0 && (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">No items found</h3>
            <p className="text-gray-500 mt-1">Try adjusting your filters or check back later.</p>
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
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="text-xl font-bold text-gray-900">Request Item</h3>
              <button onClick={() => setClaimModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6">
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-1">{selectedItem.title}</h4>
                <p className="text-sm text-gray-500">Available: {selectedItem.quantityAvailable} {selectedItem.quantityUnit}</p>
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
                    className="w-24 border border-gray-300 rounded-lg px-3 py-2 text-center focus:ring-2 focus:ring-primary-500 focus:outline-none"
                  />
                  <span className="text-gray-500">{selectedItem.quantityUnit}</span>
                </div>
              </div>

              {selectedItem.transactionType === "exchange" && (
                <div className="mb-6 p-4 bg-blue-50 text-blue-800 rounded-xl text-sm border border-blue-100">
                  <p className="font-semibold mb-1">Exchange Item</p>
                  <p>This is an exchange listing. The donor may contact you to discuss what you can offer in return.</p>
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
                  className="flex-1 py-2.5 rounded-xl font-bold text-white bg-primary-600 hover:bg-primary-700 transition-colors shadow-sm"
                >
                  Confirm Request
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;