import { useState } from "react";
import { MapPin, Clock, Package, User, Star } from "lucide-react";
import { motion } from "framer-motion";

export default function DonationCard({ item, onClaim, itemClaims, currentUser, onAccept, onReject }) {
  const [imageIdx, setImageIdx] = useState(0);

  const getStatusColor = (status) => {
    switch (status) {
      case "available": return "bg-green-100 text-green-700";
      case "requested": return "bg-yellow-100 text-yellow-700";
      case "claimed": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const isOwner = currentUser && item.user?._id === currentUser._id;
  const hasRequested = itemClaims?.some(c => c.requester?._id === currentUser?._id);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }} 
      animate={{ opacity: 1, scale: 1 }} 
      className="bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col h-full"
    >
      {/* Image Gallery */}
      <div className="relative h-48 bg-gray-100 w-full group">
        {item.images && item.images.length > 0 ? (
          <>
            <img src={item.images[imageIdx]} alt={item.title} className="w-full h-full object-cover" />
            {item.images.length > 1 && (
              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1">
                {item.images.map((_, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setImageIdx(idx)}
                    className={`w-2 h-2 rounded-full ${idx === imageIdx ? 'bg-white' : 'bg-white/50'}`}
                  />
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <Package className="w-12 h-12 opacity-50" />
          </div>
        )}
        <div className="absolute top-3 right-3">
          <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm uppercase tracking-wider ${getStatusColor(item.status)}`}>
            {item.status}
          </span>
        </div>
        <div className="absolute top-3 left-3 flex gap-2">
          <span className="bg-white/90 backdrop-blur-sm text-gray-800 px-2 py-1 rounded shadow-sm text-xs font-medium uppercase tracking-wide">
            {item.category || 'General'}
          </span>
          <span className="bg-primary-500/90 backdrop-blur-sm text-white px-2 py-1 rounded shadow-sm text-xs font-medium uppercase tracking-wide">
            {item.transactionType || item.type}
          </span>
        </div>
      </div>

      <div className="p-5 flex-grow flex flex-col">
        <h3 className="font-bold text-lg text-gray-900 mb-1 line-clamp-1">{item.title}</h3>
        <p className="text-sm text-gray-600 line-clamp-2 mb-4 flex-grow">{item.description}</p>

        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-500 gap-2">
            <MapPin className="w-4 h-4 text-gray-400" />
            <span className="line-clamp-1">{item.location}</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-500 gap-2">
            <Package className="w-4 h-4 text-gray-400" />
            <div className="flex flex-col">
               <span className="font-medium text-gray-900">{item.quantityAvailable} {item.quantityUnit} left</span>
               <span className="text-[10px] text-gray-400">Total Posted: {item.quantityValue} | Claimed: {item.quantityValue - item.quantityAvailable}</span>
            </div>
          </div>

          {item.category === "food" && item.expiresAt && (
            <div className="flex items-center text-sm text-red-500 gap-2 font-medium">
              <Clock className="w-4 h-4" />
              <span>
                Exp: {new Date(item.expiresAt).toLocaleDateString('en-GB', { 
                  day: 'numeric', 
                  month: 'short', 
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>
          )}

          {item.transactionType === "resale" && (
            <div className="flex items-center text-sm gap-2">
              <span className="text-gray-400 line-through">₹{item.originalPrice}</span>
              <span className="text-green-600 font-bold text-lg">₹{item.resalePrice}</span>
            </div>
          )}
        </div>

        {/* User Info */}
        <div className="flex items-center gap-3 pt-4 border-t border-gray-100 mb-4">
          <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center overflow-hidden border border-white shadow-sm">
            {item.user?.profilePic ? (
              <img src={item.user.profilePic} alt="" className="w-full h-full object-cover" />
            ) : (
              <span className="text-xs font-bold text-primary-600 uppercase">{item.user?.name?.charAt(0)}</span>
            )}
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-900">{item.user?.name}</span>
            <div className="flex items-center gap-1 text-xs text-yellow-500">
              <Star className="w-3 h-3 fill-current" />
              <span>{item.user?.rating || "New"}</span>
              {item.user?.role === "organization" && (
                 <div className="flex items-center gap-1">
                    <span className="px-1.5 py-0.5 bg-blue-600 text-white rounded text-[10px] uppercase font-bold tracking-wider shadow-sm">Organization</span>
                    {item.user?.verified && (
                       <div className="w-3.5 h-3.5 bg-blue-500 rounded-full flex items-center justify-center border border-white" title="Verified NGO">
                          <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                       </div>
                    )}
                 </div>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-auto">
          {!isOwner ? (
            <button
              onClick={() => onClaim(item)}
              disabled={item.quantityAvailable <= 0 || hasRequested || item.isSafe === false}
              className={`w-full py-2.5 rounded-lg text-sm font-bold transition-all ${
                item.quantityAvailable > 0 && !hasRequested && item.isSafe !== false
                  ? "bg-slate-900 hover:bg-slate-800 text-white shadow-sm"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
              }`}
            >
              {hasRequested ? "Request Pending" : 
               item.isSafe === false ? "Safety Limit Reached" :
               item.quantityAvailable > 0 ? "Request Item" : "Out of Stock"}
            </button>
          ) : (
            <div className="space-y-2">
              <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Manage Requests</div>
              {itemClaims?.length > 0 ? (
                itemClaims.map(c => (
                  <div key={c._id} className="flex items-center justify-between bg-gray-50 p-2 rounded-lg border border-gray-100">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-gray-800">{c.requester?.name}</span>
                      <span className="text-[10px] text-gray-500">Qty: {c.quantityRequested}</span>
                    </div>
                    <div className="flex gap-1">
                      <button onClick={() => onAccept(c._id)} className="px-2 py-1 bg-green-500 hover:bg-green-600 text-white rounded text-xs font-medium">Accept</button>
                      <button onClick={() => onReject(c._id)} className="px-2 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-xs font-medium">Reject</button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-sm text-gray-400 italic text-center py-2">No requests yet</div>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
