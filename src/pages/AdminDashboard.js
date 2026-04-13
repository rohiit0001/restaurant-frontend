import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import Navbar from "../components/Navbar";

function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("stats");
  const [menuItems, setMenuItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editingItem, setEditingItem] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "Fast Food",
    image: ""
  });

  const [editFormData, setEditFormData] = useState({
    name: "",
    price: "",
    category: "Fast Food",
    image: ""
  });

  useEffect(() => {
    // Check if admin is authenticated
    const adminAuth = localStorage.getItem("adminAuthenticated");
    if (!adminAuth) {
      navigate("/admin-login");
      return;
    }

    fetchMenuItems();
    fetchOrders();
    fetchMessages();
    fetchUsers();
  }, [navigate]);

  const fetchMenuItems = async () => {
    try {
      const res = await API.get("/menu");
      setMenuItems(res.data || []);
    } catch (err) {
      console.log(err);
      setError("Failed to load menu items");
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await API.get("/orders");
      setOrders(res.data || []);
    } catch (err) {
      console.log(err);
      setError("Failed to load orders");
    }
  };

  const fetchMessages = async () => {
    try {
      const res = await API.get("/messages/all");
      console.log("Messages loaded:", res.data);
      setMessages(res.data || []);
    } catch (err) {
      console.error("Error loading messages:", err);
      setError("Failed to load messages");
    }
  };

  const deleteMessage = async (id) => {
    if (!window.confirm("Are you sure you want to delete this message?")) return;

    try {
      const res = await API.delete(`/messages/${id}`);
      console.log("Message deleted:", res.data);
      alert("Message deleted successfully!");
      fetchMessages();
    } catch (err) {
      console.error("Error deleting message:", err);
      alert("Failed to delete message");
    }
  };

  const fetchUsers = async () => {
    try {
      console.log("Fetching users from /auth/users");
      const res = await API.get("/auth/users");
      console.log("Users loaded successfully:", res.data);
      setUsers(res.data || []);
    } catch (err) {
      console.error("Error loading users - Status:", err.response?.status, "Data:", err.response?.data, "Message:", err.message);
      setError(`Failed to load users: ${err.response?.status || err.message}`);
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) return;

    try {
      console.log("Deleting user:", id);
      const res = await API.delete(`/auth/users/${id}`);
      console.log("User deleted successfully:", res.data);
      alert("User deleted successfully!");
      fetchUsers();
    } catch (err) {
      console.error("Error deleting user - Status:", err.response?.status, "Data:", err.response?.data, "Message:", err.message);
      alert(`Failed to delete user: ${err.response?.status || err.message}`);
    }
  };

  const handleAddItem = async () => {
    if (!formData.name || !formData.price) {
      alert("Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      await API.post("/menu", formData);
      alert("Item added successfully!");
      setFormData({ name: "", price: "", category: "Fast Food", image: "" });
      fetchMenuItems();
    } catch (err) {
      console.log(err);
      alert("Failed to add item");
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (item) => {
    setEditingItem(item._id);
    setEditFormData({
      name: item.name,
      price: item.price,
      category: item.category,
      image: item.image || ""
    });
  };

  const handleUpdateItem = async () => {
    if (!editFormData.name || !editFormData.price) {
      alert("Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      await API.put(`/menu/${editingItem}`, editFormData);
      alert("Item updated successfully!");
      setEditingItem(null);
      fetchMenuItems();
    } catch (err) {
      console.log(err);
      alert("Failed to update item");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteItem = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;

    try {
      await API.delete(`/menu/${id}`);
      alert("Item deleted successfully!");
      fetchMenuItems();
    } catch (err) {
      console.log(err);
      alert("Failed to delete item");
    }
  };

  const stats = [
    { label: "Total Orders", value: orders.length, icon: "📦" },
    { label: "Menu Items", value: menuItems.length, icon: "🍔" },
    { label: "Registered Users", value: users.length, icon: "👥" },
    { label: "Total Revenue", value: `₹${orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0).toFixed(0)}`, icon: "💰" }
  ];

  return (
    <div>
      <Navbar />
      <section className="section">
        <div className="container">
          <h1 style={{ marginBottom: "2rem" }}>Admin Dashboard 🔧</h1>

          {error && <div className="alert alert-error" style={{ marginBottom: "1.5rem" }}>{error}</div>}

          {/* STATS */}
          {activeTab === "stats" && (
            <>
              <div className="grid grid-4 gap-3" style={{ marginBottom: "2rem" }}>
                {stats.map((stat, idx) => (
                  <div key={idx} className="card text-center">
                    <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>{stat.icon}</div>
                    <p className="text-muted" style={{ marginBottom: "0.5rem" }}>{stat.label}</p>
                    <h2 style={{ color: "#FF5E62", marginBottom: 0 }}>{stat.value}</h2>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* TAB NAVIGATION */}
          <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem", borderBottom: "2px solid #E8EAED", flexWrap: "wrap" }}>
            {["stats", "menu", "orders", "messages", "users"].map(tab => (
              <button
                key={tab}
                className="btn"
                onClick={() => setActiveTab(tab)}
                style={{
                  border: "none",
                  background: activeTab === tab ? "#FF5E62" : "transparent",
                  color: activeTab === tab ? "white" : "#7F8C99",
                  borderRadius: 0,
                  borderBottom: activeTab === tab ? "3px solid #FF5E62" : "none",
                  padding: "1rem 1.5rem",
                  fontWeight: activeTab === tab ? "700" : "600",
                  boxShadow: "none"
                }}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* MENU MANAGEMENT */}
          {activeTab === "menu" && (
            <div className="grid" style={{ gridTemplateColumns: "1fr 350px", gap: "2rem" }}>
              <div>
                <h3 style={{ marginBottom: "1.5rem" }}>📋 Menu Items</h3>
                {menuItems.length > 0 ? (
                  <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                      <thead>
                        <tr style={{ borderBottom: "2px solid #E8EAED" }}>
                          <th style={{ textAlign: "left", padding: "1rem" }}>Name</th>
                          <th style={{ textAlign: "left", padding: "1rem" }}>Category</th>
                          <th style={{ textAlign: "right", padding: "1rem" }}>Price</th>
                          <th style={{ textAlign: "center", padding: "1rem" }}>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {menuItems.map(item => (
                          <tr key={item._id} style={{ borderBottom: "1px solid #E8EAED" }}>
                            <td style={{ padding: "1rem" }}>{item.name}</td>
                            <td style={{ padding: "1rem" }}>{item.category}</td>
                            <td style={{ padding: "1rem", textAlign: "right", fontWeight: "600" }}>₹{item.price}</td>
                            <td style={{ padding: "1rem", textAlign: "center", display: "flex", gap: "0.5rem", justifyContent: "center" }}>
                              <button className="btn btn-sm btn-outline" onClick={() => handleEditClick(item)}>Edit</button>
                              <button className="btn btn-sm" style={{ background: "#EF4444", color: "white", border: "none" }} onClick={() => handleDeleteItem(item._id)}>Delete</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-muted">No items added yet</p>
                )}
              </div>

              <div>
                <h3 style={{ marginBottom: "1.5rem" }}>➕ Add Item</h3>
                <div className="card">
                  <div className="form-group">
                    <label>Food Name</label>
                    <input
                      type="text"
                      placeholder="Food name"
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label>Food Price</label>
                    <input
                      type="number"
                      placeholder="Food prize"
                      value={formData.price}
                      onChange={e => setFormData({ ...formData, price: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label>Category</label>
                    <select
                      value={formData.category}
                      onChange={e => setFormData({ ...formData, category: e.target.value })}
                    >
                      <option>Fast Food</option>
                      <option>Breakfast</option>
                      <option>Lunch</option>
                      <option>Dinner</option>
                      <option>Drinks</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Image URL</label>
                    <input
                      type="url"
                      placeholder="Image URL"
                      value={formData.image}
                      onChange={e => setFormData({ ...formData, image: e.target.value })}
                    />
                  </div>

                  <button className="btn btn-primary btn-full" onClick={handleAddItem} disabled={loading}>
                    {loading ? "Adding..." : "Add Item"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* EDIT ITEM MODAL */}
          {editingItem && (
            <div style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              background: "rgba(0,0,0,0.5)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 1000
            }}>
              <div className="card" style={{ width: "100%", maxWidth: "500px", margin: "2rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                  <h3>Edit Menu Item</h3>
                  <button
                    style={{
                      background: "none",
                      border: "none",
                      fontSize: "1.5rem",
                      cursor: "pointer",
                      color: "#7F8C99"
                    }}
                    onClick={() => setEditingItem(null)}
                  >
                    ✕
                  </button>
                </div>

                <div className="form-group">
                  <label>Food Name</label>
                  <input
                    type="text"
                    value={editFormData.name}
                    onChange={e => setEditFormData({ ...editFormData, name: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Food Price</label>
                  <input
                    type="number"
                    value={editFormData.price}
                    onChange={e => setEditFormData({ ...editFormData, price: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Category</label>
                  <select
                    value={editFormData.category}
                    onChange={e => setEditFormData({ ...editFormData, category: e.target.value })}
                  >
                    <option>Fast Food</option>
                    <option>Breakfast</option>
                    <option>Lunch</option>
                    <option>Dinner</option>
                    <option>Drinks</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Image URL</label>
                  <input
                    type="url"
                    value={editFormData.image}
                    onChange={e => setEditFormData({ ...editFormData, image: e.target.value })}
                  />
                </div>

                <div style={{ display: "flex", gap: "1rem" }}>
                  <button className="btn btn-outline btn-full" onClick={() => setEditingItem(null)}>Cancel</button>
                  <button className="btn btn-primary btn-full" onClick={handleUpdateItem} disabled={loading}>
                    {loading ? "Updating..." : "Update Item"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ORDERS MANAGEMENT */}
          {activeTab === "orders" && (
            <div>
              <h3 style={{ marginBottom: "1.5rem" }}>📦 All Orders</h3>
              {orders.length > 0 ? (
                <div style={{ display: "grid", gap: "1.5rem" }}>
                  {orders.map(order => (
                    <div key={order._id} className="card">
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "1rem" }}>
                        <div>
                          <h4 style={{ marginBottom: "0.5rem" }}>Order #{order._id?.toString().slice(-8).toUpperCase()}</h4>
                          <p className="text-muted" style={{ fontSize: "14px" }}>
                            Customer: {order.customerName || "N/A"}
                          </p>
                        </div>
                        <select
                          style={{
                            padding: "0.5rem",
                            borderRadius: "8px",
                            border: "2px solid #E8EAED",
                            fontWeight: "600",
                            color: order.status === "pending" ? "#F59E0B" : order.status === "confirmed" ? "#3B82F6" : "#10B981"
                          }}
                          value={order.status || "pending"}
                          onChange={e => alert("Update status feature coming soon!")}
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>

                      <p style={{ fontSize: "14px", marginBottom: "1rem" }}>
                        <strong>Items:</strong> {order.items?.length || 0} items | <strong>Total:</strong> ₹{(order.totalAmount || 0).toFixed(2)}
                      </p>

                      {order.deliveryAddress && (
                        <p style={{ fontSize: "14px", color: "#7F8C99" }}>
                          <strong>Delivery:</strong> {order.deliveryAddress}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted">No orders yet</p>
              )}
            </div>
          )}

          {/* MESSAGES MANAGEMENT */}
          {activeTab === "messages" && (
            <div>
              <h3 style={{ marginBottom: "1.5rem" }}>💬 Customer Messages ({messages.length})</h3>
              {messages.length > 0 ? (
                <div style={{ display: "grid", gap: "1.5rem" }}>
                  {messages.map(msg => (
                    <div key={msg._id} className="card">
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "1rem" }}>
                        <div style={{ flex: 1 }}>
                          <h4 style={{ marginBottom: "0.5rem" }}>{msg.name}</h4>
                          <p className="text-muted" style={{ fontSize: "14px", marginBottom: "0.5rem" }}>
                            📧 <a href={`mailto:${msg.email}`}>{msg.email}</a>
                          </p>
                          <p style={{ fontSize: "14px", color: "#7F8C99" }}>
                            {new Date(msg.createdAt).toLocaleDateString()} {new Date(msg.createdAt).toLocaleTimeString()}
                          </p>
                        </div>
                        <button
                          className="btn btn-sm"
                          style={{ background: "#EF4444", color: "white", border: "none" }}
                          onClick={() => deleteMessage(msg._id)}
                        >
                          Delete
                        </button>
                      </div>

                      <div style={{
                        backgroundColor: "#F3F4F6",
                        padding: "1rem",
                        borderLeft: "4px solid #FF5E62",
                        borderRadius: "4px",
                        marginTop: "1rem"
                      }}>
                        <p style={{ margin: 0, lineHeight: "1.6", color: "#333" }}>{msg.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted">No messages yet</p>
              )}
            </div>
          )}

          {/* USERS MANAGEMENT */}
          {activeTab === "users" && (
            <div>
              <h3 style={{ marginBottom: "1.5rem" }}>👥 Registered Users ({users.length})</h3>
              {users.length > 0 ? (
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr style={{ borderBottom: "2px solid #E8EAED" }}>
                        <th style={{ textAlign: "left", padding: "1rem" }}>Name</th>
                        <th style={{ textAlign: "left", padding: "1rem" }}>Email</th>
                        <th style={{ textAlign: "center", padding: "1rem" }}>User ID</th>
                        <th style={{ textAlign: "center", padding: "1rem" }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map(user => (
                        <tr key={user._id} style={{ borderBottom: "1px solid #E8EAED" }}>
                          <td style={{ padding: "1rem", fontWeight: "600" }}>{user.name}</td>
                          <td style={{ padding: "1rem" }}>{user.email}</td>
                          <td style={{ padding: "1rem", textAlign: "center", fontSize: "0.875rem", color: "#7F8C99" }}>
                            {user._id.toString().slice(-8).toUpperCase()}
                          </td>
                          <td style={{ padding: "1rem", textAlign: "center" }}>
                            <button
                              className="btn btn-sm"
                              style={{ background: "#EF4444", color: "white", border: "none" }}
                              onClick={() => deleteUser(user._id)}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-muted">No registered users yet</p>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default AdminDashboard;