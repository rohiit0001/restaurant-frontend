import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import API from "../services/api";
import Navbar from "../components/Navbar";

function Checkout() {
  const navigate = useNavigate();
  const { cart } = useContext(CartContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    zipCode: "",
    paymentMethod: "cod"
  });

  const totalAmount = cart.reduce((sum, item) => sum + (item.price || 0), 0).toFixed(2);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = async () => {
    if (!formData.fullName || !formData.email || !formData.phone || !formData.address || !formData.city || !formData.zipCode) {
      setError("Please fill in all delivery details");
      return;
    }

    if (cart.length === 0) {
      setError("Your cart is empty!");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const orderPayload = {
        customerName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        deliveryAddress: `${formData.address}, ${formData.city} - ${formData.zipCode}`,
        items: cart,
        totalAmount: parseFloat(totalAmount),
        paymentMethod: formData.paymentMethod,
        status: "pending"
      };

      const response = await API.post("/orders", orderPayload);
      
      if (response.data) {
        setStep(3);
        localStorage.setItem("lastOrder", JSON.stringify(response.data));
      }
    } catch (err) {
      console.log(err);
      setError(err.response?.data?.msg || "Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0 && step === 1) {
    return (
      <div>
        <Navbar />
        <section className="section">
          <div className="container text-center">
            <h2 style={{ marginBottom: '2rem' }}>Your cart is empty</h2>
            <p className="text-muted" style={{ marginBottom: '2rem' }}>Add some delicious items before checkout</p>
            <button className="btn btn-primary" onClick={() => navigate("/menu")}>
              Back to Menu
            </button>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <section className="section">
        <div className="container">
          <h2 style={{ marginBottom: '2rem' }}>Checkout</h2>

          <div className="grid" style={{ gridTemplateColumns: '1fr 350px', gap: '2rem' }}>
            <div>
              {/* Step Indicator */}
              <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                <div style={{ flex: 1, padding: '1rem', textAlign: 'center', borderRadius: '8px', background: step >= 1 ? '#FF5E62' : '#E8EAED', color: step >= 1 ? 'white' : '#7F8C99', fontWeight: '600' }}>1. Delivery</div>
                <div style={{ flex: 1, padding: '1rem', textAlign: 'center', borderRadius: '8px', background: step >= 2 ? '#FF5E62' : '#E8EAED', color: step >= 2 ? 'white' : '#7F8C99', fontWeight: '600' }}>2. Payment</div>
                <div style={{ flex: 1, padding: '1rem', textAlign: 'center', borderRadius: '8px', background: step >= 3 ? '#FF5E62' : '#E8EAED', color: step >= 3 ? 'white' : '#7F8C99', fontWeight: '600' }}>3. Confirm</div>
              </div>

              {error && <div className="alert alert-error" style={{ marginBottom: '1.5rem' }}>{error}</div>}

              {step < 3 && (
                <div className="card">
                  {step === 1 && (
                    <div>
                      <h3 style={{ marginBottom: '1.5rem' }}>Delivery Details</h3>

                      <div className="form-group">
                        <label>Full Name</label>
                        <input type="text" name="fullName" placeholder="Write full name" value={formData.fullName} onChange={handleInputChange} />
                      </div>

                      <div className="form-group">
                        <label>Email Address</label>
                        <input type="email" name="email" placeholder="Write email address" value={formData.email} onChange={handleInputChange} />
                      </div>

                      <div className="form-group">
                        <label>Phone Number</label>
                        <input type="tel" name="phone" placeholder="Write phone number" value={formData.phone} onChange={handleInputChange} />
                      </div>

                      <div className="form-group">
                        <label>Street Address</label>
                        <input type="text" name="address" placeholder="Write street address" value={formData.address} onChange={handleInputChange} />
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div className="form-group">
                          <label>City</label>
                          <input type="text" name="city" placeholder="Write city name" value={formData.city} onChange={handleInputChange} />
                        </div>
                        <div className="form-group">
                          <label>ZIP Code</label>
                          <input type="text" name="zipCode" placeholder="Write ZIP code" value={formData.zipCode} onChange={handleInputChange} />
                        </div>
                      </div>

                      <button className="btn btn-primary btn-full" onClick={() => setStep(2)}>Continue to Payment</button>
                    </div>
                  )}

                  {step === 2 && (
                    <div>
                      <h3 style={{ marginBottom: '1.5rem' }}>Payment Method</h3>
                      <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', border: '2px solid #FF5E62', borderRadius: '8px', cursor: 'pointer', background: '#FFF5F5' }}>
                          <input type="radio" name="paymentMethod" value="cod" checked={formData.paymentMethod === 'cod'} onChange={handleInputChange} />
                          <div>
                            <strong>💳 Cash on Delivery</strong>
                            <p style={{ fontSize: '12px', color: '#7F8C99' }}>Pay when you receive your order</p>
                          </div>
                        </label>
                      </div>

                      <div style={{ display: 'flex', gap: '1rem' }}>
                        <button className="btn btn-outline btn-full" onClick={() => setStep(1)}>Back</button>
                        <button className="btn btn-primary btn-full" onClick={handlePlaceOrder} disabled={loading}>{loading ? "Processing..." : "Place Order"}</button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {step === 3 && (
                <div className="card text-center">
                  <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>✅</div>
                  <h2 style={{ color: '#10B981', marginBottom: '1rem' }}>Order Placed Successfully!</h2>
                  <p className="text-muted" style={{ marginBottom: '1.5rem' }}>Thank you for your order. Your food will be delivered shortly.</p>
                  <p style={{ marginBottom: '1.5rem', fontSize: '14px' }}>
                    <strong>Order ID:</strong> #{Math.random().toString(36).substr(2, 9).toUpperCase()}
                  </p>
                  <button className="btn btn-primary btn-full" onClick={() => navigate("/orders")}>Track Your Order</button>
                  <button className="btn btn-outline btn-full" style={{ marginTop: '0.5rem' }} onClick={() => navigate("/menu")}>Order More</button>
                </div>
              )}
            </div>

            {/* Order Summary Sidebar */}
            <div>
              <div className="card" style={{ position: 'sticky', top: '100px' }}>
                <h3 style={{ marginBottom: '1.5rem' }}>Order Summary</h3>
                <div style={{ maxHeight: '300px', overflowY: 'auto', marginBottom: '1.5rem' }}>
                  {cart.map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1rem', borderBottom: '1px solid #E8EAED', marginBottom: '1rem' }}>
                      <div>
                        <p style={{ fontWeight: '600', marginBottom: '0.25rem' }}>{item.name}</p>
                        <p style={{ fontSize: '12px', color: '#7F8C99' }}>₹{item.price.toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ paddingTop: '1rem', borderTop: '2px solid #E8EAED' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span>Subtotal:</span>
                    <span>₹{totalAmount}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: '#7F8C99' }}>
                    <span>Delivery:</span>
                    <span>₹0</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', color: '#7F8C99' }}>
                    <span>Tax:</span>
                    <span>₹{(totalAmount * 0.05).toFixed(2)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '18px', fontWeight: '700', color: '#FF5E62' }}>
                    <span>Total:</span>
                    <span>₹{(parseFloat(totalAmount) + parseFloat(totalAmount) * 0.05).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Checkout;
