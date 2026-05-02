import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { toast } from "react-toastify";

function ResetPassword() {
  const [form, setForm] = useState({
    email: "",
    mobile: "",
    newPassword: ""
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await API.post("/auth/reset-password", form);
      toast.success("Password reset successful");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Reset failed");
    }

    setLoading(false);
  };

  const inputStyle = {
    width: "100%",
    padding: "12px 16px",
    borderRadius: "8px",
    border: "1.5px solid #e5e7eb",
    fontSize: "15px",
    outline: "none",
    fontFamily: "'DM Sans', sans-serif",
    color: "#1c1c1c",
    transition: "border-color 0.2s",
    boxSizing: "border-box",
    background: "#fafafa",
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #f0fdfb 0%, #f7f5f0 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "24px",
      fontFamily: "'DM Sans', sans-serif",
    }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Playfair+Display:wght@700&display=swap');`}</style>

      <div style={{ width: "100%", maxWidth: "420px" }}>

        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "32px", cursor: "pointer" }} onClick={() => navigate("/")}>
          <span style={{ fontSize: "36px" }}>🤝</span>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "24px", fontWeight: "700", color: "#0f766e", margin: "8px 0 4px" }}>ShareCycle</h1>
          <p style={{ color: "#9ca3af", fontSize: "14px" }}>Community Donation Platform</p>
        </div>

        {/* Card */}
        <div style={{ background: "white", borderRadius: "20px", padding: "36px", boxShadow: "0 4px 32px rgba(0,0,0,0.08)", border: "1px solid #f3f4f6" }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "26px", fontWeight: "700", color: "#1c1c1c", marginBottom: "6px" }}>
            Reset Password
          </h2>
          <p style={{ color: "#9ca3af", fontSize: "14px", marginBottom: "28px" }}>
            Enter your details to reset your password
          </p>

          <form onSubmit={handleSubmit}>
            {/* EMAIL */}
            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#374151", marginBottom: "6px" }}>
                Email Address
              </label>
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                onChange={handleChange}
                required
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = "#0f766e"}
                onBlur={e => e.target.style.borderColor = "#e5e7eb"}
              />
            </div>

            {/* MOBILE */}
            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#374151", marginBottom: "6px" }}>
                Mobile Number
              </label>
              <input
                type="text"
                name="mobile"
                placeholder="Enter your mobile number"
                onChange={handleChange}
                required
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = "#0f766e"}
                onBlur={e => e.target.style.borderColor = "#e5e7eb"}
              />
            </div>

            {/* NEW PASSWORD */}
            <div style={{ marginBottom: "24px" }}>
              <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#374151", marginBottom: "6px" }}>
                New Password
              </label>
              <input
                type="password"
                name="newPassword"
                placeholder="••••••••"
                onChange={handleChange}
                required
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = "#0f766e"}
                onBlur={e => e.target.style.borderColor = "#e5e7eb"}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "13px",
                borderRadius: "10px",
                background: loading ? "#9ca3af" : "#0f766e",
                color: "white",
                fontWeight: "600",
                fontSize: "15px",
                border: "none",
                cursor: loading ? "not-allowed" : "pointer",
                fontFamily: "'DM Sans', sans-serif",
                transition: "background 0.2s",
              }}
              onMouseEnter={e => { if (!loading) e.target.style.background = "#0d6460"; }}
              onMouseLeave={e => { if (!loading) e.target.style.background = "#0f766e"; }}
            >
              {loading ? (
                <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                  <span style={{ display: "inline-block", width: "16px", height: "16px", border: "2px solid white", borderTop: "2px solid transparent", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
                  Resetting...
                </span>
              ) : "Reset Password"}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p style={{ textAlign: "center", marginTop: "20px", color: "#6b7280", fontSize: "14px" }}>
          Remember your password?{" "}
          <button
            onClick={() => navigate("/login")}
            style={{ color: "#0f766e", fontWeight: "600", background: "none", border: "none", cursor: "pointer", fontSize: "14px" }}
          >
            Login here
          </button>
        </p>

      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

export default ResetPassword;