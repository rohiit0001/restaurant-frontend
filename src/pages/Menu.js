import { useEffect, useState, useContext } from "react";
import API from "../services/api";
import { CartContext } from "../context/CartContext";
import MenuCard from "../components/MenuCard";
import Navbar from "../components/Navbar";

function Menu() {
  const [menu, setMenu] = useState([]);
  const [category, setCategory] = useState("All");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    setLoading(true);
    setError(null);
    let url = "/api/menu";

    if (category !== "All") {
      url = `/api/menu?category=${category}`;
    }

    API.get(url)
      .then(res => {
        setMenu(res.data || []);
        setLoading(false);
      })
      .catch(err => {
        console.log(err);
        setError("Failed to load menu items");
        setLoading(false);
      });
  }, [category]);

  const categories = ["All", "Breakfast", "Lunch", "Dinner", "Fast Food", "Drinks"];

  return (
    <div>
      <Navbar />

      <section className="section">
        <div className="container">
          <div className="section-title">
            <h2>Our Menu 🍔</h2>
            <p>Choose from our delicious selection of dishes</p>
          </div>

          {/* CATEGORY FILTERS */}
          <div className="filter-buttons">
            {categories.map(cat => (
              <button
                key={cat}
                className={`filter-btn ${category === cat ? 'active' : ''}`}
                onClick={() => setCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* ERROR MESSAGE */}
          {error && <div className="alert alert-error">{error}</div>}

          {/* LOADING STATE */}
          {loading && <div className="text-center"><p>Loading menu items...</p></div>}

          {/* MENU ITEMS GRID */}
          {!loading && menu.length > 0 ? (
            <div className="grid grid-3 gap-3">
              {menu.map(item => (
                <MenuCard key={item._id} item={item} addToCart={addToCart} />
              ))}
            </div>
          ) : (
            !loading && <p className="text-center text-muted">No items available in this category</p>
          )}
        </div>
      </section>
    </div>
  );
}

export default Menu;