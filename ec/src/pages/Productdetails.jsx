import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const Productdetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [avgRating, setAvgRating] = useState(0);
  const [ratingBreakdown, setRatingBreakdown] = useState({});

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
    if (!rating || !feedback) return alert("Please give both rating and feedback.");

    const newReview = { rating: Number(rating), feedback, user: "Anonymous User" };

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
      }
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };

  if (!product) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <p className="text-gray-600 text-lg">Loading product details...</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-white to-gray-50 min-h-screen flex flex-col items-center w-screen overflow-x-hidden p-4 sm:p-8">
      {/* Product Section */}
      <div className="w-full max-w-7xl bg-white shadow-xl rounded-3xl overflow-hidden flex flex-col md:flex-row items-center md:items-start gap-10 md:gap-16 p-6 sm:p-10 border border-gray-100">
        {/* Image */}
        <div className="flex justify-center items-center w-full md:w-[45%] bg-gray-50 rounded-2xl p-4">
          <img
            src={product.image}
            alt={product.title}
            className="w-72 h-72 sm:w-80 sm:h-80 md:w-full md:h-[400px] object-contain rounded-2xl transition-transform duration-300 hover:scale-105"
          />
        </div>

        {/* Details */}
        <div className="flex flex-col justify-start w-full md:w-[55%] space-y-5">
          <h1 className="text-3xl font-bold text-gray-900 leading-tight">{product.title}</h1>

          <p className="text-gray-600 text-base leading-relaxed border-b pb-2">
            {product.description}
          </p>

          <p className="text-lg text-gray-700">
            <span className="font-semibold">Category:</span> {product.category}
          </p>

          <p className="text-3xl font-bold text-green-600">₹{product.price}</p>

          <div className="flex items-center gap-2">
            <p className="text-yellow-500 font-semibold text-xl">⭐ {avgRating}</p>
            <p className="text-gray-500 text-sm">({reviews.length} reviews)</p>
          </div>

          {/* Rating Breakdown */}
          <div className="mt-4 space-y-1">
            {Object.entries(ratingBreakdown)
              .reverse()
              .map(([stars, count]) => (
                <div key={stars} className="flex items-center gap-2">
                  <p className="w-28 text-sm font-semibold text-gray-700 flex items-center ">
                    {Array.from({ length: Number(stars) }, (_, i) => (
                        <span key={i} className="text-yellow-500 text-lg">★</span>
                                                                ))}
                        </p>

                  <div className="w-40 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-yellow-400"
                      style={{
                        width:
                          reviews.length > 0
                            ? `${(count / reviews.length) * 100}%`
                            : "0%",
                      }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-600">{count}</p>
                </div>
              ))}
          </div>

          <button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white py-3 px-8 rounded-xl text-base font-semibold shadow-md transition-all duration-200 mt-4">
            🛒 Add to Cart
          </button>
        </div>
      </div>

      {/* Review Section */}
      <div className="w-full max-w-5xl mt-14 space-y-10">
        {/* Show Reviews */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4 border-b pb-2">
            Customer Reviews
          </h2>
          {reviews.length > 0 ? (
            <div className="grid sm:grid-cols-2 gap-5">
              {reviews.slice(0, 4).map((rev, index) => (
                <div
                  key={index}
                  className="border border-gray-100 rounded-2xl p-5 shadow-sm bg-white hover:shadow-md transition-all duration-200"
                >
                  <p className="text-yellow-500 font-semibold">⭐ {rev.rating}/5</p>
                  <p className="text-gray-800 mt-2">{rev.feedback}</p>
                  <p className="text-gray-500 text-sm mt-2 italic">- {rev.user}</p>
                  <p className="text-gray-400 text-xs mt-1">
                    {new Date(rev.createdAt).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center">
              No reviews yet. Be the first to review this product!
            </p>
          )}
        </div>

        {/* Add Review */}
        <div className="bg-white shadow-xl rounded-3xl p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            Share Your Experience
          </h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-gray-700 font-medium mb-2">Rating</label>
              <select
                value={rating}
                onChange={(e) => setRating(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2 w-full sm:w-48 outline-none focus:ring-2 focus:ring-yellow-400"
              >
                <option value="">Select rating</option>
                {[1, 2, 3, 4, 5].map((r) => (
                  <option key={r} value={r}>
                    {r} ⭐
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">Feedback</label>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                rows="4"
                className="border border-gray-300 rounded-lg px-4 py-2 w-full resize-none outline-none focus:ring-2 focus:ring-yellow-400"
                placeholder="Tell us about your experience..."
              />
            </div>

            <button
              type="submit"
              className="bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-8 rounded-xl font-semibold transition-all duration-200"
            >
              Submit Review
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Productdetails;
