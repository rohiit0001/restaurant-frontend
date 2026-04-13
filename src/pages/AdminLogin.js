import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Simple admin password - change this to something secure!
  const ADMIN_PASSWORD = "admin123";

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (password === ADMIN_PASSWORD) {
      // Store admin session in localStorage
      localStorage.setItem("adminAuthenticated", "true");
      localStorage.setItem("adminLoginTime", new Date().getTime());
      navigate("/admin");
    } else {
      setError("❌ Incorrect admin password");
      setPassword("");
    }
    setLoading(false);
  };

  return (
    <>
      <Navbar />
      <section className="section" style={{ minHeight: "80vh", display: "flex", alignItems: "center" }}>
        <div className="container" style={{ maxWidth: "400px" }}>
          <div className="card">
            <h2 style={{ textAlign: "center", marginBottom: "1rem" }}>🔐 Admin Portal</h2>
            <p style={{ textAlign: "center", color: "#7F8C99", marginBottom: "2rem" }}>
              Enter admin password to access the dashboard
            </p>

            {error && <div className="alert alert-error" style={{ marginBottom: "1rem" }}>{error}</div>}

            <form onSubmit={handleLogin}>
              <div className="form-group">
                <label>Admin Password</label>
                <input
                  type="password"
                  placeholder="Enter admin password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoFocus
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-full"
                disabled={loading}
              >
                {loading ? "Checking..." : "Access Admin Dashboard"}
              </button>
            </form>

            <p style={{ textAlign: "center", marginTop: "1.5rem", fontSize: "0.875rem", color: "#7F8C99" }}>
              📝 For development: password is "admin123"<br/>
              ⚠️ Change this in production!
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

export default AdminLogin;
