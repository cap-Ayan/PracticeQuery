import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const Productdetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [avgRating, setAvgRating] = useState(0);

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
    const avg =
      reviews.reduce((sum, rev) => sum + (rev.rating || 0), 0) / reviews.length;
    setAvgRating(avg.toFixed(1));
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
    <div className="bg-white min-h-screen flex flex-col items-center w-screen overflow-x-hidden p-4 sm:p-8">
      {/* Product Section */}
      <div className="w-full max-w-7xl flex flex-col md:flex-row items-center gap-10 md:gap-20">
        {/* Image */}
        <div className="flex justify-center items-center w-full md:w-[45%]">
          <img
            src={product.image}
            alt={product.title}
            className="w-72 h-72 sm:w-80 sm:h-80 md:w-full md:h-[400px] object-contain rounded-2xl shadow-lg transition-transform duration-300 hover:scale-105"
          />
        </div>

        {/* Details */}
        <div className="flex flex-col justify-center md:justify-start w-full md:w-[45%] space-y-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{product.title}</h1>

          <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
            {product.description}
          </p>

          <p className="text-base sm:text-lg text-gray-700">
            <span className="font-semibold">Category:</span> {product.category}
          </p>

          <p className="text-xl sm:text-2xl font-bold text-green-600">₹{product.price}</p>

          <div className="flex items-center gap-2">
            <p className="text-yellow-500 font-medium text-lg">
              ⭐ {avgRating}/5
            </p>
            <p className="text-gray-500 text-sm">({reviews.length} reviews)</p>
          </div>

          <button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-xl text-sm sm:text-base font-semibold shadow-md transition-all duration-200">
            Add to Cart
          </button>
        </div>
      </div>

      {/* Review Section */}
      <div className="w-full max-w-5xl mt-12 border-t pt-8 space-y-8">
        {/* Show Reviews */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Customer Reviews</h2>
          {reviews.length > 0 ? (
            <div className="space-y-4">
              {reviews.slice(0, 3).map((rev, index) => (
                <div key={index} className="border rounded-xl p-4 shadow-sm bg-gray-50">
                  <p className="text-yellow-500 font-semibold">⭐ {rev.rating}/5</p>
                  <p className="text-gray-700 mt-1">{rev.feedback}</p>
                  <p className="text-gray-500 text-sm mt-1">- {rev.user}</p>
                  <p className="text-gray-400 text-xs">
                    {new Date(rev.createdAt).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No reviews yet. Be the first to review this product!</p>
          )}
        </div>

        {/* Add Review */}
        <div className="mt-10 text-gray-800 border-none outline-none ">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Give Your Rating & Feedback
          </h2>
          <form
            onSubmit={handleSubmit}
            className="bg-gray-50  rounded-2xl p-6 space-y-4 shadow-2xl"
          >
            <div>
              <label className="block text-gray-700 font-medium mb-1">Rating:</label>
              <select
                value={rating}
                onChange={(e) => setRating(e.target.value)}
                className="border border-black/20 rounded-lg px-3 py-2 w-full sm:w-48 flex items-center justify-center outline-none"
              >
                <option value="" className="text-gray-800">Select rating</option>
                {[1, 2, 3, 4, 5].map((r) => (
                  <option key={r} value={r} className="text-black/70">
                    {r} ⭐
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">Feedback:</label>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                rows="4"
                className="border border-black/20 rounded-lg px-3 py-2 w-full resize-none outline-none"
                placeholder="Share your experience..."
              />
            </div>

            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white py-2 px-6 rounded-xl font-semibold transition-all duration-200"
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
