import { useEffect, useState } from "react";
import API from "../services/api";
import { toast } from "react-toastify";

function MyRequests() {
  const [claims, setClaims] = useState([]);

  const fetchClaims = async () => {
    try {
      const res = await API.get("/claims"); // we will add this backend
      setClaims(res.data);
    } catch (err) {
      toast.error("Error fetching claims");
    }
  };

  useEffect(() => {
    fetchClaims();
  }, []);

  const handleAccept = async (id) => {
    try {
      await API.put(`/claims/accept/${id}`);
      toast.success("Accepted");
      fetchClaims();
    } catch {
      toast.error("Error");
    }
  };

  const handleReject = async (id) => {
    try {
      await API.put(`/claims/reject/${id}`);
      toast.success("Rejected");
      fetchClaims();
    } catch {
      toast.error("Error");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">My Requests</h1>

      {claims.map((c) => (
        <div key={c._id} className="border p-4 mb-3 rounded">
          <p><b>Item:</b> {c.donation.title}</p>
          <p><b>Requester:</b> {c.requester.name}</p>

          <div className="mt-2 flex gap-2">
            <button
              onClick={() => handleAccept(c._id)}
              className="bg-green-500 text-white px-3 py-1 rounded"
            >
              Accept
            </button>

            <button
              onClick={() => handleReject(c._id)}
              className="bg-red-500 text-white px-3 py-1 rounded"
            >
              Reject
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default MyRequests;