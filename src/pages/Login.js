import { useState, useContext } from "react";
import API from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { AuthContext } from "../context/AuthContext";

function Login() {
  const [data, setData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleLogin = async () => {
    if (!data.email || !data.password) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      const res = await API.post("/auth/login", data);
      console.log("Login response:", res.data);
      
      if (res.data.token) {
        const userData = res.data.user || { email: data.email };
        login(res.data.token, userData);
        // Force navigation after state update
        setTimeout(() => {
          navigate("/menu");
        }, 100);
      } else {
        setError("Login failed: No token received");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(err.response?.data?.msg || err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <section className="section" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
        <div className="container" style={{ maxWidth: '400px' }}>
          <div className="card">
            <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Login to FoodieHub</h2>

            {error && <div className="alert alert-error">{error}</div>}

            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={data.email}
                onChange={e => setData({ ...data, email: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                value={data.password}
                onChange={e => setData({ ...data, password: e.target.value })}
              />
            </div>

            <button
              className="btn btn-primary btn-full"
              onClick={handleLogin}
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>

            <p style={{ textAlign: 'center', marginTop: '1rem', color: '#7F8C99' }}>
              Don't have an account? <Link to="/register" style={{ color: '#FF5E62', fontWeight: '600' }}>Register here</Link>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

export default Login;