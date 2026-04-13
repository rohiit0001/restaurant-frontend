import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { AuthContext } from "../context/AuthContext";

function Profile() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  if (!user) {
    return (
      <>
        <Navbar />
        <section className="section" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
          <div className="container">
            <div className="card" style={{ maxWidth: '500px', margin: '0 auto', textAlign: 'center', padding: '2rem' }}>
              <h2 style={{ marginBottom: '1rem' }}>Please Login First</h2>
              <p style={{ color: '#7F8C99', marginBottom: '1.5rem' }}>You need to login to view your profile</p>
              <button
                className="btn btn-primary"
                onClick={() => navigate("/login")}
              >
                Go to Login
              </button>
            </div>
          </div>
        </section>
      </>
    );
  }

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
      <Navbar />
      <section className="section">
        <div className="container">
          <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
              <div style={{
                width: '100px',
                height: '100px',
                borderRadius: '50%',
                backgroundColor: '#FF5E62',
                margin: '0 auto 1.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '3rem',
                color: 'white'
              }}>
                👤
              </div>

              <h2 style={{ marginBottom: '0.5rem', color: '#333' }}>{user.name}</h2>
              <p style={{ color: '#7F8C99', marginBottom: '2rem' }}>{user.email}</p>

              <div style={{
                backgroundColor: '#F3F4F6',
                padding: '1.5rem',
                borderRadius: '8px',
                marginBottom: '2rem',
                textAlign: 'left'
              }}>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontSize: '0.875rem', color: '#7F8C99', marginBottom: '0.5rem' }}>
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={user.name}
                    disabled
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #E8EAED',
                      borderRadius: '4px',
                      backgroundColor: 'white',
                      fontWeight: '600'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', color: '#7F8C99', marginBottom: '0.5rem' }}>
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={user.email}
                    disabled
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #E8EAED',
                      borderRadius: '4px',
                      backgroundColor: 'white',
                      fontWeight: '600'
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <button
                  className="btn btn-outline btn-full"
                  onClick={() => navigate("/orders")}
                >
                  📦 My Orders
                </button>
                <button
                  className="btn btn-primary btn-full"
                  onClick={handleLogout}
                  style={{ backgroundColor: '#EF4444' }}
                >
                  Logout
                </button>
              </div>
            </div>

            <div className="card" style={{ marginTop: '2rem', padding: '1.5rem' }}>
              <h3 style={{ marginBottom: '1rem' }}>Account Info</h3>
              <p style={{ color: '#7F8C99', marginBottom: '0.5rem' }}>
                <strong>User ID:</strong> {user._id}
              </p>
              <p style={{ color: '#7F8C99' }}>
                Welcome to FoodieHub! You can place orders and track them from here.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Profile;
