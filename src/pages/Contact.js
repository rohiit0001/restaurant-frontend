import React, { useState, useContext } from 'react';
import Navbar from '../components/Navbar';
import API from '../services/api';
import { AuthContext } from '../context/AuthContext';

function Contact() {
  const { user } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      if (!formData.name || !formData.email || !formData.message) {
        setErrorMessage('All fields are required');
        setLoading(false);
        return;
      }

      console.log('Sending message:', formData);
      const response = await API.post('/messages/send', {
        ...formData,
        userId: user?._id || null
      });

      console.log('Message response:', response.data);
      setSuccessMessage('Your message has been sent successfully! We will get back to you soon.');
      setFormData({
        name: user?.name || '',
        email: user?.email || '',
        message: ''
      });
    } catch (error) {
      console.error('Message error:', error);
      const errorMsg = error.response?.data?.error || error.response?.data?.message || error.message || 'Failed to send message. Please try again.';
      setErrorMessage(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />
      <section className="section">
        <div className="container">
          <div className="section-title">
            <h2>Contact Us</h2>
            <p>Send us a message and we'll respond as soon as possible</p>
          </div>

          <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <form onSubmit={handleSubmit} className="card" style={{ padding: '2rem' }}>
              {successMessage && (
                <div style={{
                  backgroundColor: '#d4edda',
                  color: '#155724',
                  padding: '1rem',
                  borderRadius: '4px',
                  marginBottom: '1rem',
                  border: '1px solid #c3e6cb'
                }}>
                  ✓ {successMessage}
                </div>
              )}

              {errorMessage && (
                <div style={{
                  backgroundColor: '#f8d7da',
                  color: '#721c24',
                  padding: '1rem',
                  borderRadius: '4px',
                  marginBottom: '1rem',
                  border: '1px solid #f5c6cb'
                }}>
                  ✗ {errorMessage}
                </div>
              )}

              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label htmlFor="name" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Your name"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '1rem',
                    boxSizing: 'border-box'
                  }}
                  disabled={user?.name ? true : false}
                />
              </div>

              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label htmlFor="email" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Your email"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '1rem',
                    boxSizing: 'border-box'
                  }}
                  disabled={user?.email ? true : false}
                />
              </div>

              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label htmlFor="message" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Your message..."
                  rows="6"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '1rem',
                    boxSizing: 'border-box',
                    fontFamily: 'inherit'
                  }}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  fontSize: '1rem',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.6 : 1
                }}
              >
                {loading ? 'Sending...' : 'Send Message'}
              </button>
            </form>

            <div style={{ marginTop: '2rem', textAlign: 'center', color: '#666' }}>
              <h3 style={{ marginBottom: '1rem' }}>Direct Contact</h3>
              <p>
                <strong>📞 Phone:</strong> <a href="tel:9521757508" style={{ color: '#007bff', textDecoration: 'none' }}>9521757508</a>
              </p>
              <p>
                <strong>📧 Email:</strong> <a href="mailto:2004rohitvishu@gmail.com" style={{ color: '#007bff', textDecoration: 'none' }}>2004rohitvishu@gmail.com</a>
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Contact;
