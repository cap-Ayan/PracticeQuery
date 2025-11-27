import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { useSelector } from "react-redux";

const Productdetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [avgRating, setAvgRating] = useState(0);
  const [ratingBreakdown, setRatingBreakdown] = useState({});
  const [filterReviews, setfilterReviews] = useState([]);
  const user = useSelector((state) => state.user.userInfo);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/products/${id}`);
        const data = await res.json();
        console.log('Product detail API response:', data);

        // Handle the response - could be direct object or nested in 'product' key
        const productData = data.product || data;

        // Map fields to match component expectations
        const mappedProduct = {
          _id: productData.id || productData._id,
          title: productData.name || productData.title,
          price: productData.price,
          quantity: productData.quantity || 0,
          description: productData.description || '',
          image: productData.image ? `http://localhost:3000/${productData.image}` : 'https://via.placeholder.com/500x500?text=No+Image',
          discountPercentage: productData.discountPercentage || 0
        };

        console.log('Mapped product:', mappedProduct);
        setProduct(mappedProduct);
      } catch (error) {
        console.error("Error fetching product details:", error);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!user || !user._id) {
      toast.error("Please login to add items to cart.");
      navigate("/signin");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/api/cart/addToCart",
        {
          userId: user._id,
          productId: product._id,
          quantity: 1,
        },
        { withCredentials: true }
      );

      if (res.data.success) {
        toast.success("Added to cart!");
      } else {
        toast.error(res.data.message || "Failed to add.");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Server error.");
    }
  };

  if (!product) {
    return (
      <div className="flex justify-center items-center h-screen bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-600 font-medium">Loading product details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen flex flex-col items-center w-full overflow-x-hidden p-4 sm:p-8 animate-fade-in font-sans">

      {/* Back Button */}
      <div className="w-full max-w-7xl mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-slate-600 hover:text-indigo-600 transition-colors font-medium"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back
        </button>
      </div>

      {/* Product Section */}
      <div className="w-full max-w-7xl bg-white shadow-xl rounded-3xl overflow-hidden flex flex-col md:flex-row gap-10 md:gap-16 p-6 sm:p-10 border border-slate-100 animate-scale-in relative">

        {product?.discountPercentage > 0 && (
          <div className="absolute top-6 right-6 bg-red-500 text-white text-sm font-bold px-4 py-2 rounded-full shadow-lg z-10 animate-pulse-soft">
            -{product.discountPercentage}% OFF
          </div>
        )}

        <div className="flex justify-center items-center w-full md:w-[45%] bg-slate-50 rounded-2xl p-8 group border border-slate-100 relative overflow-hidden">
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-auto max-h-[500px] object-contain rounded-2xl transition-transform duration-500 group-hover:scale-105 mix-blend-multiply relative z-10"
            onError={(e) => { e.target.src = 'https://via.placeholder.com/500x500?text=No+Image'; }}
          />
        </div>

        <div className="flex flex-col justify-start w-full md:w-[55%] space-y-8 animate-slide-in">

          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 leading-tight tracking-tight mb-4">
            {product.title}
          </h1>

          <p className="text-slate-600 text-lg leading-relaxed border-b border-slate-100 pb-8">
            {product.description}
          </p>

          <div className="space-y-6">
            <div className="flex items-baseline gap-4">
              <p className="text-5xl font-extrabold text-slate-900">₹{product.price}</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                onClick={handleAddToCart}
                disabled={product.quantity <= 0}
                className="flex-1 bg-slate-900 hover:bg-indigo-600 text-white py-4 px-8 rounded-2xl text-lg font-bold shadow-xl transition-all duration-300"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Productdetails;
