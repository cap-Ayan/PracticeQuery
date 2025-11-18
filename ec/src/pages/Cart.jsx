import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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
  }, [navigate]);

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

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading cart...</div>;
  }

  if (cartItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
        <p className="text-2xl text-gray-700 mb-4">Your cart is empty!</p>
        <button
          onClick={() => navigate('/')}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
        >
          Start Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Your Shopping Cart</h2>
        <div className="space-y-4">
          {cartItems.map((item) => (
            <div key={item.product._id} className="flex items-center justify-between border-b pb-4">
              <div className="flex items-center space-x-4">
                <img src={item.product.image} alt={item.product.title} className="w-20 h-20 object-cover rounded-md" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{item.product.title}</h3>
                  <p className="text-gray-600">Quantity: {item.quantity}</p>
 <p className="text-gray-600">In Stock: {item.product.quantity}</p>
                  <p className="text-gray-800 font-medium">Price: ${item.product.price.toFixed(2)}</p>
                </div>
              </div>
              <button
                onClick={() => handleRemoveFromCart(item.product._id)}
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
        <div className="mt-6 text-right">
          <p className="text-xl font-bold text-gray-900">
            Total: ${cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0).toFixed(2)}
          </p>
          <button
            onClick={() => toast.info('Checkout functionality coming soon!')}
            className="mt-4 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg transition duration-300"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart