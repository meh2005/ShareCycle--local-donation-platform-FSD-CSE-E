import { useState, useEffect } from "react";
import API from "../services/api";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import { UploadCloud, CheckCircle2, Package, MapPin, X } from "lucide-react";
import { motion } from "framer-motion";

function CreateDonation() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  const [form, setForm] = useState({
    transactionType: "donate",
    category: "food",
    title: "",
    description: "",
    condition: "fresh",
    location: "",
    expiresAt: "",
    cookedAt: "",
    quantityValue: 1,
    quantityUnit: "items",
    size: "",
    gender: "",
    originalPrice: "",
    resalePrice: "",
    contact: "",
    verified: false,
    images: []
  });

  useEffect(() => {
    if (isEditMode) {
      fetchDonation();
    }
  }, [id]);

  const fetchDonation = async () => {
    try {
      const res = await API.get(`/donations/${id}`);
      const d = res.data;
      setForm({
        transactionType: d.transactionType || "donate",
        category: d.category || "food",
        title: d.title || "",
        description: d.description || "",
        condition: d.condition || "fresh",
        location: d.location || "",
        expiresAt: d.expiresAt ? new Date(d.expiresAt).toISOString().slice(0, 16) : "",
        cookedAt: d.cookedAt ? new Date(d.cookedAt).toISOString().slice(0, 16) : "",
        quantityValue: d.quantityValue || 1,
        quantityUnit: d.quantityUnit || "items",
        size: d.size || "",
        gender: d.gender || "",
        originalPrice: d.originalPrice || "",
        resalePrice: d.resalePrice || "",
        contact: d.contact || "",
        verified: d.verified || false,
        images: d.images || []
      });
    } catch (err) {
      toast.error("Failed to load donation data");
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    
    if (files.length + form.images.length > 5) {
      toast.error("Maximum 5 images allowed");
      return;
    }

    setUploading(true);
    const base64Promises = files.map(file => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
      });
    });

    try {
      const base64Images = await Promise.all(base64Promises);
      setForm({ ...form, images: [...form.images, ...base64Images] });
      toast.success("Images ready for database");
    } catch (err) {
      toast.error("Failed to process images");
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index) => {
    const newImages = [...form.images];
    newImages.splice(index, 1);
    setForm({ ...form, images: newImages });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.transactionType === "resale" && !form.verified) {
      toast.error("Please confirm item condition");
      return;
    }

    setLoading(true);
    try {
      const submitData = {
        ...form,
        coordinates: { lat: 25.1504, lng: 82.5833 }
      };

      if (isEditMode) {
        await API.put(`/donations/${id}`, submitData);
        toast.success("Updated successfully!");
      } else {
        await API.post("/donations", submitData);
        toast.success("Posted successfully!");
      }
      navigate("/feed");
    } catch (err) {
      toast.error(err.response?.data?.message || "Error saving listing");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            {isEditMode ? "Edit Listing" : "Create a Listing"}
          </h1>
          <p className="mt-2 text-lg text-gray-500">
            {isEditMode ? "Update your shared item details" : "Share your items with the community"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8 bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          
          {/* Type & Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Listing Type</label>
              <select name="transactionType" value={form.transactionType} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary-500 focus:outline-none">
                <option value="donate">Give Away (Free)</option>
                <option value="resale">Resale</option>
                <option value="exchange">Exchange</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select name="category" value={form.category} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary-500 focus:outline-none">
                <option value="food">Food</option>
                <option value="clothes">Clothes</option>
                <option value="furniture">Furniture</option>
                <option value="toys">Toys</option>
                <option value="household">Household</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          {/* Images */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Upload Images</label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl hover:border-primary-500 transition-colors">
              <div className="space-y-1 text-center">
                <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600 justify-center">
                  <label className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none">
                    <span>Upload files</span>
                    <input type="file" multiple accept="image/*" className="sr-only" onChange={handleImageUpload} disabled={uploading} />
                  </label>
                </div>
                <p className="text-xs text-gray-500">PNG, JPG up to 5MB (Max 5)</p>
                {uploading && <p className="text-xs text-primary-500 font-bold animate-pulse">Uploading...</p>}
              </div>
            </div>
            
            {form.images.length > 0 && (
              <div className="flex gap-4 mt-4 overflow-x-auto pb-2">
                {form.images.map((url, idx) => (
                  <div key={idx} className="relative flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                    <img src={url} alt="upload" className="w-full h-full object-cover" />
                    <button type="button" onClick={() => removeImage(idx)} className="absolute top-1 right-1 bg-black/50 text-white p-1 rounded-full hover:bg-red-500">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Basic Details */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
              <input name="title" value={form.title} onChange={handleChange} required placeholder="What are you listing?" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary-500 focus:outline-none" />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea name="description" value={form.description} onChange={handleChange} required rows={4} placeholder="Describe the item, condition, and any other details..." className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary-500 focus:outline-none" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location (Area, City)</label>
                  <input name="location" value={form.location} onChange={handleChange} required placeholder="e.g. Vindhyachal, Mirzapur" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary-500 focus:outline-none" />
               </div>
               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Contact Number</label>
                  <input name="contact" value={form.contact} onChange={handleChange} required placeholder="Phone number" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary-500 focus:outline-none" />
               </div>
            </div>

            {/* Condition */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Condition</label>
              <select name="condition" value={form.condition} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary-500 focus:outline-none">
                 {form.category === "food" ? (
                    <>
                      <option value="fresh">Freshly Cooked</option>
                      <option value="packed">Packed</option>
                      <option value="near_expiry">Near Expiry</option>
                    </>
                 ) : (
                    <>
                      <option value="new">New / Unused</option>
                      <option value="like_new">Like New</option>
                      <option value="used">Used / Good</option>
                      <option value="poor">Needs Repair</option>
                    </>
                 )}
              </select>
            </div>
            
            {/* Quantity */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                <input type="number" name="quantityValue" value={form.quantityValue} min="1" onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary-500 focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Unit</label>
                <select name="quantityUnit" value={form.quantityUnit} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary-500 focus:outline-none">
                  <option value="items">Items / Pieces</option>
                  <option value="kgs">Kilograms (kg)</option>
                  <option value="ltrs">Liters (L)</option>
                  <option value="persons">Persons (Food portion)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Conditional Fields based on Category */}
          {form.category === "food" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-yellow-50 rounded-2xl border border-yellow-100">
              <div>
                <label className="block text-sm font-medium text-yellow-800 mb-2">Cooked/Packed Time</label>
                <input type="datetime-local" name="cookedAt" value={form.cookedAt} onChange={handleChange} className="w-full bg-white border border-yellow-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-yellow-500 focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-yellow-800 mb-2">Expiry Time (Required)</label>
                <input type="datetime-local" name="expiresAt" value={form.expiresAt} onChange={handleChange} required className="w-full bg-white border border-yellow-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-yellow-500 focus:outline-none" />
              </div>
            </div>
          )}

          {form.category === "clothes" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-purple-50 rounded-2xl border border-purple-100">
               <div>
                <label className="block text-sm font-medium text-purple-800 mb-2">Size</label>
                <input name="size" value={form.size} onChange={handleChange} placeholder="e.g. M, L, 32" className="w-full bg-white border border-purple-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-purple-800 mb-2">Gender Category</label>
                <input name="gender" value={form.gender} onChange={handleChange} placeholder="e.g. Men, Women, Kids" className="w-full bg-white border border-purple-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:outline-none" />
              </div>
            </div>
          )}

          {form.transactionType === "resale" && (
            <div className="space-y-4 p-6 bg-green-50 rounded-2xl border border-green-100">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-green-800 mb-2">Original Price (₹)</label>
                  <input type="number" name="originalPrice" value={form.originalPrice} onChange={handleChange} required placeholder="0" className="w-full bg-white border border-green-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-green-800 mb-2">Your Resale Price (₹)</label>
                  <input type="number" name="resalePrice" value={form.resalePrice} onChange={handleChange} required placeholder="0" className="w-full bg-white border border-green-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none" />
                </div>
              </div>
              
              <div className="flex items-start mt-4">
                <div className="flex items-center h-5">
                  <input id="verified" name="verified" type="checkbox" checked={form.verified} onChange={handleChange} className="focus:ring-green-500 h-4 w-4 text-green-600 border-gray-300 rounded" />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="verified" className="font-medium text-green-800">Quality Guarantee</label>
                  <p className="text-green-600">I confirm this item is in good condition and worth the requested price.</p>
                </div>
              </div>
            </div>
          )}

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading || uploading}
              className={`w-full flex justify-center py-4 border border-transparent rounded-xl shadow-sm text-lg font-bold text-white ${
                loading || uploading ? "bg-primary-400 cursor-not-allowed" : "bg-primary-600 hover:bg-primary-700"
              } transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500`}
            >
              {loading ? "Posting..." : "List Item Now"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateDonation;