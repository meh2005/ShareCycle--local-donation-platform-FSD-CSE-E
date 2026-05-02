import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { toast } from "react-toastify";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await API.post("/auth/login", form);
      localStorage.setItem("user", JSON.stringify(res.data));
      toast.success("Login successful");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
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
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "24px", fontWeight: "700", color: "#0f766e", margin: "8px 0 4px" }}>ShareCycle ♻️</h1>
          <p style={{ color: "#9ca3af", fontSize: "14px" }}>Community Donation Platform</p>
        </div>

        {/* Card */}
        <div style={{ background: "white", borderRadius: "20px", padding: "36px", boxShadow: "0 4px 32px rgba(0,0,0,0.08)", border: "1px solid #f3f4f6" }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "26px", fontWeight: "700", color: "#1c1c1c", marginBottom: "6px" }}>Welcome back</h2>
          <p style={{ color: "#9ca3af", fontSize: "14px", marginBottom: "28px" }}>Sign in to your account to continue</p>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#374151", marginBottom: "6px" }}>Email or Username</label>
              <input
                type="text"
                name="email"
                placeholder="Enter email or username"
                onChange={handleChange}
                required
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = "#0f766e"}
                onBlur={e => e.target.style.borderColor = "#e5e7eb"}
              />
            </div>

            <div style={{ marginBottom: "24px" }}>
              <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#374151", marginBottom: "6px" }}>Password</label>
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                autoComplete="current-password"
                onChange={handleChange}
                required
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = "#0f766e"}
                onBlur={e => e.target.style.borderColor = "#e5e7eb"}
              />
              <br />
              <p onClick ={() => navigate("/reset")}
               style={{ textAlign: "right", marginTop: "8px", color: "#0f766e", fontSize: "13px", cursor: "pointer" }}>
                Forgot password?
              </p>
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
                  Signing in...
                </span>
              ) : "Sign In"}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p style={{ textAlign: "center", marginTop: "20px", color: "#6b7280", fontSize: "14px" }}>
          Don't have an account?{" "}
          <button onClick={() => navigate("/register")} style={{ color: "#0f766e", fontWeight: "600", background: "none", border: "none", cursor: "pointer", fontSize: "14px" }}>
            Register here
          </button>
        </p>

        <p style={{ textAlign: "center", marginTop: "10px" }}>
          <button onClick={() => navigate("/feed")} style={{ color: "#9ca3af", background: "none", border: "none", cursor: "pointer", fontSize: "13px" }}>
            ← Browse donations without account
          </button>
        </p>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

export default Login;