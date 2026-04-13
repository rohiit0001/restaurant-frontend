import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import Navbar from "../components/Navbar";
import { Link, useNavigate } from "react-router-dom";

function Cart() {
  const navigate = useNavigate();
  const { cart, removeFromCart } = useContext(CartContext);

  const totalAmount = cart.reduce((sum, item) => sum + (item.price || 0), 0).toFixed(2);

  const handleCheckout = () => {
    if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }
    navigate("/checkout");
  };

  return (
    <div>
      <Navbar />
      <section className="section">
        <div className="container">
          <h2>Shopping Cart 🛒</h2>

          {cart.length > 0 ? (
            <>
              <div style={{ overflowX: 'auto', marginTop: '2rem' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #E8EAED' }}>
                      <th style={{ textAlign: 'left', padding: '1rem' }}>Item</th>
                      <th style={{ textAlign: 'left', padding: '1rem' }}>Category</th>
                      <th style={{ textAlign: 'right', padding: '1rem' }}>Price</th>
                      <th style={{ textAlign: 'center', padding: '1rem' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cart.map(item => (
                      <tr key={item._id} style={{ borderBottom: '1px solid #E8EAED' }}>
                        <td style={{ padding: '1rem' }}>
                          <strong>{item.name}</strong>
                        </td>
                        <td style={{ padding: '1rem' }}>
                          {item.category || 'N/A'}
                        </td>
                        <td style={{ padding: '1rem', textAlign: 'right' }}>
                          <strong>₹{item.price.toFixed(2)}</strong>
                        </td>
                        <td style={{ padding: '1rem', textAlign: 'center' }}>
                          <button
                            className="btn btn-sm btn-outline"
                            onClick={() => removeFromCart(item._id)}
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                <div style={{
                  background: 'white',
                  padding: '1.5rem',
                  borderRadius: '12px',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                  minWidth: '250px'
                }}>
                  <p style={{ fontSize: '14px', color: '#7F8C99', marginBottom: '0.5rem' }}>SUBTOTAL</p>
                  <h3 style={{ fontSize: '28px', color: '#FF5E62', marginBottom: '1rem' }}>
                    ₹{totalAmount}
                  </h3>
                  <button
                    className="btn btn-primary btn-full"
                    onClick={handleCheckout}
                  >
                    Proceed to Checkout
                  </button>
                  <Link to="/menu" className="btn btn-outline btn-full" style={{ marginTop: '0.5rem' }}>
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center" style={{ marginTop: '3rem' }}>
              <p className="text-muted" style={{ fontSize: '18px', marginBottom: '1rem' }}>Your cart is empty</p>
              <Link to="/menu" className="btn btn-primary">Browse Menu</Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default Cart;