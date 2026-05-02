import { useState, useEffect } from "react";
import API from "../services/api";
import { toast } from "react-toastify";
import { Building2, MapPin, Star, Phone, Mail } from "lucide-react";
import { motion } from "framer-motion";

export default function Organizations() {
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrganizations();
  }, []);

  const fetchOrganizations = async () => {
    setLoading(true);
    try {
      // In a real app, this should be a specific endpoint /api/users?role=organization
      // Assuming the backend doesn't have this public endpoint yet, we'll fetch all donations and extract unique organizations
      // For proper implementation, we'll use a standard approach
      const res = await API.get("/donations"); 
      const orgsMap = new Map();
      res.data.forEach(don => {
         if (don.user && don.user.role === "organization") {
            if (!orgsMap.has(don.user._id)) {
               orgsMap.set(don.user._id, {
                  ...don.user,
                  donationCount: 1,
                  recentDonation: don.title,
                  location: don.location
               });
            } else {
               const existing = orgsMap.get(don.user._id);
               existing.donationCount += 1;
            }
         }
      });
      setOrganizations(Array.from(orgsMap.values()));
    } catch (err) {
      toast.error("Failed to load organizations");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Partner Organizations</h1>
          <p className="mt-4 text-lg text-gray-500 max-w-2xl mx-auto">
            Hotels, restaurants, wedding halls, and large corporations actively contributing to reduce waste and help the community.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : organizations.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
            <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900">No organizations found</h3>
            <p className="text-gray-500 mt-2">Check back later when our partners post new donations.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {organizations.map((org, index) => (
              <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: index * 0.1 }}
                key={org._id} 
                className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow flex flex-col"
              >
                <div className="h-32 bg-gradient-to-r from-blue-500 to-primary-600 relative">
                  <div className="absolute -bottom-10 left-6">
                    <div className="w-20 h-20 rounded-2xl bg-white p-1 shadow-md">
                      {org.profilePic ? (
                        <img src={org.profilePic} alt={org.name} className="w-full h-full rounded-xl object-cover" />
                      ) : (
                        <div className="w-full h-full rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
                          <Building2 className="w-8 h-8" />
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-white text-xs font-bold flex items-center gap-1 shadow-sm">
                     <Star className="w-3 h-3 fill-white" /> {org.rating || "New"}
                  </div>
                </div>

                <div className="pt-14 p-6 flex-grow flex flex-col">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{org.name}</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                     <MapPin className="w-4 h-4 text-gray-400" />
                     <span>{org.location || "Location not provided"}</span>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 mb-4 flex-grow">
                    <div className="flex justify-between items-center mb-2">
                       <span className="text-sm font-medium text-gray-700">Total Contributions</span>
                       <span className="bg-primary-100 text-primary-700 px-2 py-0.5 rounded text-xs font-bold">{org.donationCount} items</span>
                    </div>
                    <div className="text-sm text-gray-500 mt-2">
                       <span className="font-medium text-gray-700">Recent:</span> {org.recentDonation}
                    </div>
                  </div>

                  <div className="flex gap-2 mt-auto">
                    <button className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2.5 rounded-xl text-sm font-bold transition-colors flex items-center justify-center gap-2">
                      <Phone className="w-4 h-4" /> Contact
                    </button>
                    <button className="flex-1 bg-primary-50 hover:bg-primary-100 text-primary-700 py-2.5 rounded-xl text-sm font-bold transition-colors flex items-center justify-center gap-2">
                      <Building2 className="w-4 h-4" /> View Profile
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
