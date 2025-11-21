import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const handleIncreaseQuantity = async (productId) => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/cart/addToCart",
        {
          productId: productId,
          quantity: 1, // Default quantity
        },
        { withCredentials: true }
      );

      if (res.data.success) {
        setCartItems((prevItems) =>
          prevItems.map((item) =>
            item.product._id === productId
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        );
        toast.success('Quantity increased.');
      } else {
        toast.error('not enough product in stock');
      }
    } catch (error) {
      console.error('Error increasing quantity:', error);
      toast.error('not enough product in stock.');
    }
  };

  const handleDecreaseQuantity = async (productId) => {
    try {
      // Find the current item
      const currentItem = cartItems.find((item) => item.product._id === productId);

      if (!currentItem) return;

      if (currentItem.quantity === 1) {
        // If quantity would go to 0 → remove from cart
        const res = await axios.delete(
          `http://localhost:5000/api/cart/removeFromCart/${productId}`,
          { withCredentials: true }
        );

        if (res.data.success) {
          setCartItems((prevItems) =>
            prevItems.filter((item) => item.product._id !== productId)
          );
          toast.success("Item removed from cart.");
        } else {
          toast.error(res.data.message || "Failed to remove item.");
        }
      } else {
        // Otherwise just decrement
        const res = await axios.post(
          "http://localhost:5000/api/cart/addToCart",
          { productId, quantity: -1 },
          { withCredentials: true }
        );

        if (res.data.success) {
          setCartItems((prevItems) =>
            prevItems.map((item) =>
              item.product._id === productId
                ? { ...item, quantity: item.quantity - 1 }
                : item
            )
          );
          toast.success("Quantity decreased.");
        } else {
          toast.error(res.data.message || "Failed to decrease quantity.");
        }
      }
    } catch (error) {
      console.error("Error decreasing quantity:", error.response?.data || error.message);
      toast.error("Server error while updating quantity.");
    }
  };

  const getEffectivePrice = (product) => {
    const now = new Date();
    const hasDiscount =
      product.discountPercentage > 0 &&
      product.discountEndTime &&
      new Date(product.discountEndTime) > now;

    if (hasDiscount) {
      const discountedPrice =
        product.price * (1 - product.discountPercentage / 100);
      return discountedPrice;
    }
    return product.price;
  };

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/cart/getCartItems', {
          withCredentials: true,
        });
        if (res.data.success) {
          setCartItems(res.data.cartItems);
        }
      } catch (error) {
        console.error('Error fetching cart:', error);
        toast.error('Failed to load cart items.');
        if (error.response && error.response.status === 401) {
          navigate('/signin'); // Redirect to login if not authenticated
        }
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, []);

  const handleRemoveFromCart = async (productId) => {
    try {
      const res = await axios.delete(`http://localhost:5000/api/cart/removeFromCart/${productId}`, {
        withCredentials: true,
      });
      if (res.data.success) {
        setCartItems((prevItems) => prevItems.filter((item) => item.product._id !== productId));
        toast.success('Item removed from cart.');
      } else {
        toast.error(res.data.message || 'Failed to remove item from cart.');
      }
    } catch (error) {
      console.error('Error removing from cart:', error);
      toast.error('Server error while removing item.');
    }
  };

  const handleCheckout = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/cart/checkOut', {
        cartItems,
      }, {
        withCredentials: true,
      })

      if (res.data.success) {
        await axios.delete('http://localhost:5000/api/cart/removeAll', {
          withCredentials: true,
        })
        setCartItems([])
        toast.success('Order placed successfully!')

      } else {
        toast.error(res.data.message || 'Failed to place order.')
      }

    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("Failed to process checkout.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-600 font-medium">Loading cart...</p>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 p-4 animate-fade-in">
        <div className="bg-white p-10 rounded-3xl shadow-xl text-center max-w-md w-full border border-slate-100">
          <div className="text-6xl mb-6">🛒</div>
          <h2 className="text-2xl font-bold text-slate-900 mb-3">Your cart is empty</h2>
          <p className="text-slate-500 mb-8">Looks like you haven't added anything to your cart yet.</p>
          <button
            onClick={() => navigate('/')}
            className="w-full bg-slate-900 hover:bg-indigo-600 text-white font-bold py-3.5 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 active:translate-y-0"
          >
            Start Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-8 font-sans animate-fade-in">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-extrabold text-slate-900 mb-8 flex items-center gap-3">
          <span className="text-indigo-600">Shopping Cart</span>
          <span className="text-slate-400 text-2xl font-medium">({cartItems.length} items)</span>
        </h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items List */}
          <div className="flex-1 space-y-6">
            {cartItems.map((item, index) => (
              <div
                key={item.product._id}
                className="bg-white rounded-2xl shadow-sm p-6 flex flex-col sm:flex-row items-center gap-6 border border-slate-100 hover:shadow-md transition-all duration-300 animate-slide-in"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="w-full sm:w-32 h-32 bg-slate-50 rounded-xl p-2 flex-shrink-0 border border-slate-100">
                  <img
                    src={item.product.image}
                    alt={item.product.title}
                    className="w-full h-full object-contain mix-blend-multiply"
                  />
                </div>

                <div className="flex-1 w-full text-center sm:text-left">
                  <h3 className="text-lg font-bold text-slate-900 mb-1">{item.product.title}</h3>
                  <p className="text-slate-500 text-sm mb-4">{item.product.category}</p>

                  <div className="flex items-center justify-center sm:justify-start gap-4">
                    <div className="flex items-center bg-slate-100 rounded-lg p-1">
                      <button
                        onClick={() => handleDecreaseQuantity(item.product._id)}
                        className="w-8 h-8 flex items-center justify-center bg-white rounded-md shadow-sm text-slate-600 hover:text-indigo-600 font-bold transition-colors disabled:opacity-50"
                      >
                        -
                      </button>
                      <span className="w-10 text-center font-bold text-slate-900">{item.quantity}</span>
                      <button
                        onClick={() => handleIncreaseQuantity(item.product._id)}
                        className="w-8 h-8 flex items-center justify-center bg-white rounded-md shadow-sm text-slate-600 hover:text-indigo-600 font-bold transition-colors"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => handleRemoveFromCart(item.product._id)}
                      className="text-red-500 hover:text-red-700 text-sm font-medium underline decoration-red-200 hover:decoration-red-500 transition-all"
                    >
                      Remove
                    </button>
                  </div>
                </div>

                <div className="text-right min-w-[100px]">
                  <p className="text-xl font-bold text-slate-900">
                    ₹{(getEffectivePrice(item.product) * item.quantity).toFixed(2)}
                  </p>
                  {item.quantity > 1 && (
                    <p className="text-slate-400 text-xs mt-1">
                      ₹{getEffectivePrice(item.product).toFixed(2)} each
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="w-full lg:w-96 h-fit">
            <div className="bg-white rounded-3xl shadow-xl p-8 border border-slate-100 sticky top-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Order Summary</h2>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span className="font-medium text-slate-900">
                    ₹{cartItems.reduce((acc, item) => acc + getEffectivePrice(item.product) * item.quantity, 0).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Shipping</span>
                  <span className="text-green-600 font-medium">Free</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Tax</span>
                  <span className="font-medium text-slate-900">₹0.00</span>
                </div>
                <div className="border-t border-slate-100 pt-4 flex justify-between items-center">
                  <span className="text-lg font-bold text-slate-900">Total</span>
                  <span className="text-2xl font-extrabold text-indigo-600">
                    ₹{cartItems.reduce((acc, item) => acc + getEffectivePrice(item.product) * item.quantity, 0).toFixed(2)}
                  </span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full bg-slate-900 hover:bg-indigo-600 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 active:translate-y-0 flex items-center justify-center gap-2"
              >
                <span>Checkout</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>

              <p className="text-center text-slate-400 text-xs mt-6 flex items-center justify-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                Secure Checkout
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;