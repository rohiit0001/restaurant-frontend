import { useState } from "react";
import API from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar";

function Register() {
  const [data, setData] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (!data.name || !data.email || !data.password) {
      setError("Please fill in all fields");
      return;
    }

    if (data.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      await API.post("/auth/register", data);
      alert("Registered successfully! Please login.");
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.msg || "Registration failed. Please try again.");
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
            <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Create Your Account</h2>

            {error && <div className="alert alert-error">{error}</div>}

            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                placeholder="Enter your name"
                value={data.name}
                onChange={e => setData({ ...data, name: e.target.value })}
              />
            </div>

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
                placeholder="Create a password (min. 6 characters)"
                value={data.password}
                onChange={e => setData({ ...data, password: e.target.value })}
              />
            </div>

            <button
              className="btn btn-primary btn-full"
              onClick={handleRegister}
              disabled={loading}
            >
              {loading ? "Registering..." : "Register"}
            </button>

            <p style={{ textAlign: 'center', marginTop: '1rem', color: '#7F8C99' }}>
              Already have an account? <Link to="/login" style={{ color: '#FF5E62', fontWeight: '600' }}>Login here</Link>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

export default Register;