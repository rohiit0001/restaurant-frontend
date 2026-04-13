import { Link, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function Navbar() {
  const location = useLocation();
  const { user, logout } = useContext(AuthContext);
  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          🍔 FoodieHub
        </Link>
        <ul className="navbar-menu">
          <li><Link to="/" className={isActive('/') ? 'active' : ''}>Home</Link></li>
          <li><Link to="/menu" className={isActive('/menu') ? 'active' : ''}>🍽️ Menu</Link></li>
          <li><Link to="/cart" className={isActive('/cart') ? 'active' : ''}>🛒 Cart</Link></li>
          <li><Link to="/contact" className={isActive('/contact') ? 'active' : ''}>💬 Contact</Link></li>
          {user ? (
            <>
              <li><Link to="/profile" className={isActive('/profile') ? 'active' : ''}>👤 {user.name}</Link></li>
              <li><button onClick={handleLogout} style={{ background: 'none', border: 'none', color: '#7F8C99', cursor: 'pointer', fontSize: '1rem' }}>Logout</button></li>
            </>
          ) : (
            <li><Link to="/login" className={isActive('/login') ? 'active' : ''}>👤 Login</Link></li>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;