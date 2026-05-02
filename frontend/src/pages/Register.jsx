import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { toast } from "react-toastify";

function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "", mobile: "", role: "user" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await API.post("/auth/register", form);
      localStorage.setItem("user", JSON.stringify(res.data));
      toast.success(`Registered as ${form.role === 'organization' ? 'an Organization' : 'a User'}`);
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
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

  const fields = [
    { name: "name", type: "text", label: form.role === "organization" ? "Organization Name" : "Full Name", placeholder: form.role === "organization" ? "e.g. Hope Foundation" : "John Doe" },
    { name: "email", type: "email", label: "Email Address", placeholder: "you@example.com" },
    { name: "password", type: "password", label: "Password", placeholder: "Min. 6 characters" },
    { name: "mobile", type: "text", label: "Contact Number", placeholder: "+91 98765 43210" },
  ];

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
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Playfair+Display:wght@700&display=swap');
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      <div style={{ width: "100%", maxWidth: "440px" }}>

        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "32px", cursor: "pointer" }} onClick={() => navigate("/")}>
          <span style={{ fontSize: "36px" }}>🤝</span>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "24px", fontWeight: "700", color: "#0f766e", margin: "8px 0 4px" }}>ShareCycle</h1>
          <p style={{ color: "#9ca3af", fontSize: "14px" }}>Community Donation Platform</p>
        </div>

        {/* Card */}
        <div style={{ background: "white", borderRadius: "20px", padding: "36px", boxShadow: "0 4px 32px rgba(0,0,0,0.08)", border: "1px solid #f3f4f6" }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "26px", fontWeight: "700", color: "#1c1c1c", marginBottom: "6px" }}>Create Account</h2>
          <p style={{ color: "#9ca3af", fontSize: "14px", marginBottom: "28px" }}>Join your community. Start sharing today.</p>

          <div style={{ display: "flex", gap: "8px", marginBottom: "24px", background: "#f3f4f6", padding: "4px", borderRadius: "10px" }}>
             <button 
                type="button"
                onClick={() => setForm({ ...form, role: "user" })}
                style={{ flex: 1, padding: "8px", borderRadius: "8px", fontSize: "13px", fontWeight: "600", border: "none", cursor: "pointer", background: form.role === "user" ? "white" : "transparent", color: form.role === "user" ? "#0f766e" : "#6b7280", boxShadow: form.role === "user" ? "0 2px 8px rgba(0,0,0,0.05)" : "none", transition: "all 0.2s" }}
             >
                Individual
             </button>
             <button 
                type="button"
                onClick={() => setForm({ ...form, role: "organization" })}
                style={{ flex: 1, padding: "8px", borderRadius: "8px", fontSize: "13px", fontWeight: "600", border: "none", cursor: "pointer", background: form.role === "organization" ? "white" : "transparent", color: form.role === "organization" ? "#0f766e" : "#6b7280", boxShadow: form.role === "organization" ? "0 2px 8px rgba(0,0,0,0.05)" : "none", transition: "all 0.2s" }}
             >
                Organization
             </button>
          </div>

          <form onSubmit={handleSubmit}>
            {fields.map((field) => (
              <div key={field.name} style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#374151", marginBottom: "6px" }}>
                  {field.label}
                </label>
                <input
                  type={field.type}
                  name={field.name}
                  placeholder={field.placeholder}
                  onChange={handleChange}
                  required
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor = "#0f766e"}
                  onBlur={e => e.target.style.borderColor = "#e5e7eb"}
                />
              </div>
            ))}

            <div style={{ marginTop: "8px", marginBottom: "24px", padding: "12px 14px", background: "#f0fdfb", borderRadius: "8px", border: "1px solid #99f6e4" }}>
              <p style={{ fontSize: "12px", color: "#0f766e", margin: 0 }}>
                ✅ By registering, you agree to use this platform for community benefit only.
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
                  Creating Account...
                </span>
              ) : "Create Account →"}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p style={{ textAlign: "center", marginTop: "20px", color: "#6b7280", fontSize: "14px" }}>
          Already have an account?{" "}
          <button onClick={() => navigate("/login")} style={{ color: "#0f766e", fontWeight: "600", background: "none", border: "none", cursor: "pointer", fontSize: "14px" }}>
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
}

export default Register;