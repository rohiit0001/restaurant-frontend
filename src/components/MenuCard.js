import { useState } from "react";

function MenuCard({ item, addToCart }) {
  const [quantity, setQuantity] = useState(0);
  const [isAdding, setIsAdding] = useState(false);

  const handleAddClick = () => {
    setIsAdding(true);
    setQuantity(1);
  };

  const handleQuantityChange = (newQty) => {
    if (newQty >= 1) {
      setQuantity(newQty);
    }
  };

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(item);
    }
    setIsAdding(false);
    setQuantity(0);
  };

  const handleCancel = () => {
    setIsAdding(false);
    setQuantity(0);
  };

  return (
    <div className="card">
      {item.image && <img src={item.image} alt={item.name} className="card-image" />}
      <div>
        <h3 className="card-title">{item.name}</h3>
        {item.category && <p className="card-text text-muted">{item.category}</p>}
        <p className="card-price">₹{item.price.toFixed(2)}</p>
        <div className="card-footer">
          {!isAdding ? (
            <button className="btn btn-primary btn-full" onClick={handleAddClick}>
              🛒 Add to Cart
            </button>
          ) : (
            <>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.75rem' }}>
                <button
                  className="btn btn-outline btn-sm"
                  onClick={() => handleQuantityChange(quantity - 1)}
                  style={{ flex: 1 }}
                >
                  −
                </button>
                <div style={{ flex: 1, textAlign: 'center', fontWeight: '700', fontSize: '18px' }}>
                  {quantity}
                </div>
                <button
                  className="btn btn-outline btn-sm"
                  onClick={() => handleQuantityChange(quantity + 1)}
                  style={{ flex: 1 }}
                >
                  +
                </button>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  className="btn btn-secondary btn-sm btn-full"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-primary btn-sm btn-full"
                  onClick={handleAddToCart}
                >
                  Add {quantity} ✓
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default MenuCard;