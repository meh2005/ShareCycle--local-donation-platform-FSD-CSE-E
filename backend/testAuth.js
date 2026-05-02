import axios from "axios";

const testLogin = async () => {
  try {
    const res = await axios.post("http://localhost:5000/api/auth/login", {
      email: "admin",
      password: "admin123"
    });
    console.log("Login Success!");
    console.log("User Role:", res.data.role);
    console.log("Token:", res.data.token.substring(0, 10) + "...");
    
    // Now test admin endpoint
    try {
      const stats = await axios.get("http://localhost:5000/api/admin/stats", {
        headers: { Authorization: `Bearer ${res.data.token}` }
      });
      console.log("Admin Stats Success!");
    } catch (err) {
      console.log("Admin Stats Failed:", err.response?.status, err.response?.data?.message);
    }
  } catch (err) {
    console.log("Login Failed:", err.response?.status, err.response?.data?.message);
  }
};

testLogin();
