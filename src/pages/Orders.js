import { useState, useEffect } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await API.get("/orders");
        setOrders(response.data || []);
        setLoading(false);
      } catch (err) {
        console.log(err);
        setError("Failed to load orders");
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return '#F59E0B';
      case 'confirmed':
        return '#3B82F6';
      case 'delivered':
        return '#10B981';
      case 'cancelled':
        return '#EF4444';
      default:
        return '#7F8C99';
    }
  };

  return (
    <div>
      <Navbar />
      <section className="section">
        <div className="container">
          <div className="section-title">
            <h2>Your Orders 📦</h2>
            <p>Track and manage your food orders</p>
          </div>

          {error && <div className="alert alert-error">{error}</div>}

          {loading && <div className="text-center"><p>Loading your orders...</p></div>}

          {!loading && orders.length > 0 ? (
            <div style={{ display: 'grid', gap: '1.5rem' }}>
              {orders.map((order) => (
                <div key={order._id || Math.random()} className="card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1.5rem' }}>
                    <div>
                      <h3 style={{ marginBottom: '0.5rem' }}>Order #{order._id?.toString().slice(-8).toUpperCase() || Math.random().toString(36).substr(2, 9)}</h3>
                      <p className="text-muted" style={{ fontSize: '14px' }}>
                        {new Date(order.createdAt || Date.now()).toLocaleDateString()}
                      </p>
                    </div>
                    <div
                      style={{
                        padding: '0.75rem 1rem',
                        borderRadius: '8px',
                        background: getStatusColor(order.status) + '20',
                        color: getStatusColor(order.status),
                        fontWeight: '600',
                        textTransform: 'capitalize'
                      }}
                    >
                      {order.status || 'pending'}
                    </div>
                  </div>

                  {order.items && order.items.length > 0 && (
                    <div style={{ marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid #E8EAED' }}>
                      <p style={{ fontWeight: '600', marginBottom: '1rem' }}>Items:</p>
                      <div style={{ display: 'grid', gap: '0.5rem' }}>
                        {order.items.map((item, idx) => (
                          <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span>{item.name || 'Item'} x1</span>
                            <span className="text-muted">₹{(item.price || 0).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      {order.deliveryAddress && (
                        <p style={{ fontSize: '14px', color: '#7F8C99' }}>
                          <strong>Delivery:</strong> {order.deliveryAddress}
                        </p>
                      )}
                      <p style={{ fontSize: '18px', fontWeight: '700', color: '#FF5E62', marginTop: '0.5rem' }}>
                        Total: ₹{(order.totalAmount || 0).toFixed(2)}
                      </p>
                    </div>
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => alert('Detailed tracking coming soon!')}
                    >
                      Track Order
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            !loading && (
              <div className="text-center" style={{ marginTop: '3rem' }}>
                <p className="text-muted" style={{ fontSize: '18px', marginBottom: '1rem' }}>
                  No orders yet. Time to order some delicious food!
                </p>
                <Link to="/menu" className="btn btn-primary">
                  Browse Menu
                </Link>
              </div>
            )
          )}
        </div>
      </section>
    </div>
  );
}

export default Orders;