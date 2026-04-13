import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div>
      <Navbar />
      <section className="hero">
        <h1>Welcome to FoodieHub 🍔</h1>
        <p>Delicious food delivered to your door 🚀</p>
        <Link to="/menu" className="btn btn-primary btn-lg">Explore Our Menu</Link>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-title">
            <h2>Why Choose FoodieHub?</h2>
            <p>Experience the best dining experience with our premium quality food</p>
          </div>
          <div className="grid grid-3">
            <div className="card text-center">
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚡</div>
              <h3 className="card-title">Fast Delivery</h3>
              <p className="card-text">Get your food delivered hot and fresh within 30 minutes</p>
            </div>
            <div className="card text-center">
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🥗</div>
              <h3 className="card-title">Fresh Vegetables</h3>
              <p className="card-text">Only the freshest organic vegetables sourced from trusted suppliers</p>
            </div>
            <div className="card text-center">
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💰</div>
              <h3 className="card-title">Best Prices</h3>
              <p className="card-text">Enjoy delicious meals at affordable prices with special discounts</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section" style={{ backgroundColor: '#f8f9fa' }}>
        <div className="container">
          <div className="section-title">
            <h2>Contact Us</h2>
            <p>Reach out to us anytime - we'd love to hear from you!</p>
          </div>
          <div className="card" style={{ maxWidth: '600px', margin: '0 auto', padding: '2rem', textAlign: 'center' }}>
            <h3 style={{ marginBottom: '1.5rem', color: '#333' }}>Rohit</h3>
            <div style={{ marginBottom: '1rem' }}>
              <p style={{ marginBottom: '0.5rem' }}>
                <strong>📞 Phone:</strong> <a href="tel:9521757508" style={{ color: '#007bff', textDecoration: 'none' }}>9521757508</a>
              </p>
            </div>
            <div>
              <p style={{ marginBottom: '0.5rem' }}>
                <strong>📧 Email:</strong> <a href="mailto:2004rohitvishu@gmail.com" style={{ color: '#007bff', textDecoration: 'none' }}>2004rohitvishu@gmail.com</a>
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;