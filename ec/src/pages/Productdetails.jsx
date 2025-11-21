
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

  const filterStarReviews = async (rating) => {
    try {
      const res = await fetch(`http://localhost:5000/api/reviews/getFilterRating/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ rating })
      });
      const data = await res.json();
      if (data.success) {
        setfilterReviews(data.reviews);
      }
    } catch (error) {
      console.log("Error filtering reviews", error)
    }
  };

  // Fetch product + reviews
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/products/getProductById/${id}`);
        const data = await res.json();
        setProduct(data.product);
      } catch (error) {
        console.error("Error fetching product details:", error);
      }
    };

    const fetchReviews = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/reviews/getReviews/${id}`);
        const data = await res.json();
        if (data.success) {
          setReviews(data.reviews);
          calculateAverageRating(data.reviews);
          calculateRatingBreakdown(data.reviews);
        }
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    fetchProduct();
    fetchReviews();
  }, [id]);

  // Calculate average rating
  const calculateAverageRating = (reviews) => {
    if (reviews.length === 0) return setAvgRating(0);
    const avg = reviews.reduce((sum, rev) => sum + (rev.rating || 0), 0) / reviews.length;
    setAvgRating(avg.toFixed(1));
  };

  // Calculate how many people gave each rating
  const calculateRatingBreakdown = (reviews) => {
    const breakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach((rev) => {
      breakdown[rev.rating] = (breakdown[rev.rating] || 0) + 1;
    });
    setRatingBreakdown(breakdown);
  };

  // Submit new review
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rating || !feedback) return toast.error("Please give both rating and feedback.");

    const newReview = { rating: Number(rating), feedback, user: user?.userName || "Anonymous User" };

    try {
      const res = await fetch(`http://localhost:5000/api/reviews/addReview/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newReview),
      });

      const data = await res.json();
      if (data.success) {
        const updatedReviews = [data.review, ...reviews];
        setReviews(updatedReviews);
        calculateAverageRating(updatedReviews);
        calculateRatingBreakdown(updatedReviews);
        setRating(0);
        setFeedback("");
        toast.success("Review submitted successfully!");
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("Failed to submit review.");
    }
  };

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

        {/* Discount Badge */}
        {product.discountPercentage > 0 && (
          <div className="absolute top-6 right-6 bg-red-500 text-white text-sm font-bold px-4 py-2 rounded-full shadow-lg z-10 animate-pulse-soft">
            -{product.discountPercentage}% OFF
          </div>
        )}

        {/* Image */}
        <div className="flex justify-center items-center w-full md:w-[45%] bg-slate-50 rounded-2xl p-8 group border border-slate-100 relative overflow-hidden">
          <div className="absolute inset-0 bg-white/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-auto max-h-[500px] object-contain rounded-2xl transition-transform duration-500 group-hover:scale-105 mix-blend-multiply relative z-10"
          />
        </div>

        {/* Details */}
        <div className="flex flex-col justify-start w-full md:w-[55%] space-y-8 animate-slide-in">
          <div>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 leading-tight tracking-tight mb-4">{product.title}</h1>
            <div className="flex items-center gap-4">
              <span className="px-4 py-1.5 bg-indigo-50 text-indigo-700 rounded-full text-sm font-bold uppercase tracking-wide border border-indigo-100">
                {product.category}
              </span>
              <div className="flex items-center text-yellow-400 gap-1">
                <span className="text-xl">★</span>
                <span className="text-slate-900 font-bold text-lg">{avgRating}</span>
                <span className="text-slate-400 text-sm font-medium ml-1">({reviews.length} reviews)</span>
              </div>
            </div>
          </div>

          <p className="text-slate-600 text-lg leading-relaxed border-b border-slate-100 pb-8">
            {product.description}
          </p>

          <div className="space-y-6">
            <div className="flex items-baseline gap-4">
              {product.discountPercentage > 0 ? (
                <>
                  <p className="text-5xl font-extrabold text-slate-900">
                    ₹{(product.price - (product.price * product.discountPercentage) / 100).toFixed(2)}
                  </p>
                  <p className="text-2xl text-slate-400 line-through font-medium">₹{product.price}</p>
                </>
              ) : (
                <p className="text-5xl font-extrabold text-slate-900">₹{product.price}</p>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                onClick={handleAddToCart}
                disabled={product.quantity <= 0}
                className="flex-1 bg-slate-900 hover:bg-indigo-600 text-white py-4 px-8 rounded-2xl text-lg font-bold shadow-xl hover:shadow-2xl hover:shadow-indigo-500/20 transition-all duration-300 transform hover:-translate-y-1 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                {product.quantity > 0 ? (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    Add to Cart
                  </>
                ) : (
                  "Out of Stock"
                )}
              </button>
              <button className="flex-1 bg-white border-2 border-slate-200 text-slate-900 hover:border-slate-900 py-4 px-8 rounded-2xl text-lg font-bold transition-all duration-300">
                Buy Now
              </button>
            </div>
            {product.quantity > 0 && (
              <p className="text-green-600 font-medium flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                In Stock ({product.quantity} available)
              </p>
            )}
          </div>

          {/* Rating Breakdown */}
          <div className="mt-8 bg-slate-50 p-6 rounded-2xl border border-slate-100">
            <h3 className="font-bold text-slate-900 mb-4">Rating Breakdown</h3>
            <div className="space-y-3">
              {Object.entries(ratingBreakdown)
                .reverse()
                .map(([stars, count]) => (
                  <div
                    key={stars}
                    className="flex items-center gap-3 cursor-pointer group"
                    onClick={() => { filterStarReviews(stars) }}
                  >
                    <div className="w-12 text-sm font-bold text-slate-700 flex items-center gap-1">
                      {stars} <span className="text-yellow-400">★</span>
                    </div>

                    <div className="flex-1 h-2.5 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-indigo-500 rounded-full transition-all duration-500 group-hover:bg-indigo-600"
                        style={{
                          width:
                            reviews.length > 0
                              ? `${(count / reviews.length) * 100}%`
                              : "0%",
                        }}
                      ></div>
                    </div>
                    <p className="text-sm text-slate-500 font-medium w-8 text-right">{count}</p>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>

      {/* Review Section */}
      <div className="w-full max-w-5xl mt-16 space-y-12 animate-fade-in">

        {/* Add Review */}
        <div className="bg-white shadow-xl rounded-3xl p-8 sm:p-10 border border-slate-100 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
          <h2 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-3">
            <span className="bg-indigo-100 p-2 rounded-lg text-indigo-600">✍️</span>
            Write a Review
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-slate-700 font-bold mb-2 text-sm uppercase tracking-wide">Rating</label>
                <div className="relative">
                  <select
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                    className="w-full appearance-none bg-slate-50 border border-slate-200 text-slate-900 py-3.5 px-4 pr-8 rounded-xl focus:outline-none focus:bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors cursor-pointer font-medium"
                  >
                    <option value="">Select a rating</option>
                    <option value="5">5 - Excellent ⭐⭐⭐⭐⭐</option>
                    <option value="4">4 - Very Good ⭐⭐⭐⭐</option>
                    <option value="3">3 - Good ⭐⭐⭐</option>
                    <option value="2">2 - Fair ⭐⭐</option>
                    <option value="1">1 - Poor ⭐</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-2 text-sm uppercase tracking-wide">Your Feedback</label>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                rows="4"
                className="w-full bg-slate-50 border border-slate-200 text-slate-900 py-3.5 px-4 rounded-xl focus:outline-none focus:bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors resize-none font-medium"
                placeholder="What did you like or dislike? What did you use this product for?"
              />
            </div>

            <button
              type="submit"
              className="bg-slate-900 hover:bg-indigo-600 text-white py-4 px-8 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 active:translate-y-0 w-full sm:w-auto"
            >
              Submit Review
            </button>
          </form>
        </div>

        {/* Show Reviews */}
        <div>
          <h2 className="text-3xl font-bold text-slate-900 mb-8 flex items-center gap-3">
            <span className="w-2 h-8 bg-indigo-600 rounded-full block"></span>
            Customer Reviews
          </h2>

          {reviews.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-6">
              {(filterReviews.length > 0 ? filterReviews : reviews).map((rev, index) => (
                <div
                  key={index}
                  className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 animate-fade-in flex flex-col"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-lg font-bold text-slate-600">
                        {rev.user ? rev.user.charAt(0).toUpperCase() : "A"}
                      </div>
                      <div>
                        <p className="text-slate-900 font-bold text-sm">{rev.user || "Anonymous"}</p>
                        <p className="text-slate-400 text-xs">{new Date(rev.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center bg-yellow-50 px-2 py-1 rounded-lg border border-yellow-100">
                      <span className="text-yellow-500 text-sm mr-1">★</span>
                      <span className="text-slate-900 font-bold text-sm">{rev.rating}.0</span>
                    </div>
                  </div>

                  <p className="text-slate-600 leading-relaxed flex-1">
                    "{rev.feedback}"
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-300">
              <div className="text-6xl mb-4">💬</div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">No reviews yet</h3>
              <p className="text-slate-500">Be the first to share your thoughts on this product!</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Productdetails;
