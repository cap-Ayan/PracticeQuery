
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
  const [filterReviews, setfilterReviews] = useState([]);


  const filterStarReviews = async (rating) => {
     try {
      console.log(rating)
      const res=await fetch(`http://localhost:5000/api/reviews/getFilterRating/${id}`,{
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        },
        body:JSON.stringify({rating})
      });
      const data = await res.json();
      if (data.success) {
        setfilterReviews(data.reviews);
        
      }
     } catch (error) {
      console.log("Error filtering reviews",error)
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
    <div className="bg-[#f4f4f5] min-h-screen flex flex-col items-center w-full overflow-x-hidden p-4 sm:p-8 animate-fade-in">
      {/* Product Section */}
      <div className="w-full max-w-7xl bg-white shadow-2xl rounded-3xl overflow-hidden flex flex-col md:flex-row items-center md:items-start gap-10 md:gap-16 p-6 sm:p-10 border border-slate-200 animate-scale-in">
        {/* Image */}
        <div className="flex justify-center items-center w-full md:w-[45%] bg-slate-50 rounded-2xl p-6 group border border-slate-200">
          <img
            src={product.image}
            alt={product.title}
            className="w-72 h-72 sm:w-80 sm:h-80 md:w-full md:h-[400px] object-contain rounded-2xl transition-transform duration-500 group-hover:scale-110"
          />
        </div>

        {/* Details */}
        <div className="flex flex-col justify-start w-full md:w-[55%] space-y-6 animate-slide-in">
          <h1 className="text-4xl font-bold text-slate-900 leading-tight">{product.title}</h1>

          <p className="text-slate-600 text-base leading-relaxed border-b border-slate-200 pb-4">
            {product.description}
          </p>

          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-slate-100 text-slate-800 rounded-full text-sm font-medium">
              {product.category}
            </span>
          </div>

          <div className="flex items-baseline gap-3">
            <p className="text-4xl font-bold text-slate-900">₹{product.price}</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center">
              <span className="text-slate-900 text-2xl mr-1">★</span>
              <p className="text-2xl font-bold text-slate-900">{avgRating}</p>
            </div>
            <p className="text-slate-500 text-sm">({reviews.length} reviews)</p>
          </div>

          {/* Rating Breakdown */}
          <div className="mt-4 space-y-2">
            {Object.entries(ratingBreakdown)
              .reverse()
              .map(([stars, count]) => (
                <div 
                  key={stars} 
                  className="flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg-slate-50 transition-colors duration-200" 
                  onClick={()=>{filterStarReviews(stars)}}
                >
                  <div className="w-24 text-sm font-semibold text-slate-700 flex items-center">
                    {Array.from({ length: Number(stars) }, (_, i) => (
                      <span key={i} className="text-slate-900 text-base">★</span>
                    ))}
                  </div>

                  <div className="flex-1 h-2.5 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-slate-900 rounded-full transition-all duration-500"
                      style={{
                        width:
                          reviews.length > 0
                            ? `${(count / reviews.length) * 100}%`
                            : "0%",
                      }}
                    ></div>
                  </div>
                  <p className="text-sm text-slate-600 font-medium w-8 text-right">{count}</p>
                </div>
              ))}
          </div>

          <button className="w-full sm:w-auto bg-slate-900 hover:bg-black text-white py-3.5 px-10 rounded-xl text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-200 mt-6 transform hover:scale-105 active:scale-95">
            🛒 Add to Cart
          </button>
        </div>
      </div>

      {/* Review Section */}
      <div className="w-full max-w-5xl mt-14 space-y-10 animate-fade-in">
        {/* Show Reviews */}
        <div>
          <h2 className="text-3xl font-bold text-slate-900 mb-6 border-b border-slate-200 pb-3">
            Customer Reviews
          </h2>
          {reviews.length > 0 ? (
  <div className="grid sm:grid-cols-2 gap-6">
    {filterReviews.length > 0
      ? filterReviews.map((rev, index) => (
          <div
            key={index}
            className="border border-slate-200 rounded-2xl p-6 shadow-sm bg-white hover:shadow-lg hover:-translate-y-1 transition-all duration-300 animate-fade-in"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="text-slate-900 text-xl">★</span>
              <p className="text-lg font-bold text-slate-900">{rev.rating}/5</p>
            </div>
            <p className="text-slate-700 mt-3 leading-relaxed">{rev.feedback}</p>
            <div className="mt-4 pt-3 border-t border-slate-100">
              <p className="text-slate-600 text-sm font-medium">- {rev.user}</p>
              <p className="text-slate-400 text-xs mt-1">
                {new Date(rev.createdAt).toLocaleString()}
              </p>
            </div>
          </div>
        ))
      : reviews.map((rev, index) => (
          <div
            key={index}
            className="border border-slate-200 rounded-2xl p-6 shadow-sm bg-white hover:shadow-lg hover:-translate-y-1 transition-all duration-300 animate-fade-in"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="text-slate-900 text-xl">★</span>
              <p className="text-lg font-bold text-slate-900">{rev.rating}/5</p>
            </div>
            <p className="text-slate-700 mt-3 leading-relaxed">{rev.feedback}</p>
            <div className="mt-4 pt-3 border-t border-slate-100">
              <p className="text-slate-600 text-sm font-medium">- {rev.user}</p>
              <p className="text-slate-400 text-xs mt-1">
                {new Date(rev.createdAt).toLocaleString()}
              </p>
            </div>
          </div>
        ))}
  </div>
) : (
  <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
    <p className="text-slate-500 text-lg">
      No reviews yet. Be the first to review this product! ✨
    </p>
  </div>
)}

        </div>

        {/* Add Review */}
        <div className="bg-white shadow-xl rounded-3xl p-8 border border-slate-200 animate-fade-in">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">
            Share Your Experience
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-slate-700 font-medium mb-2 text-sm">Rating</label>
              <select
                value={rating}
                onChange={(e) => setRating(e.target.value)}
                className="border border-slate-300 rounded-xl px-4 py-3 w-full sm:w-48 outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all duration-200 bg-white hover:border-slate-400"
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
              <label className="block text-slate-700 font-medium mb-2 text-sm">Feedback</label>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                rows="4"
                className="border border-slate-300 rounded-xl px-4 py-3 w-full resize-none outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all duration-200 bg-white hover:border-slate-400"
                placeholder="Tell us about your experience..."
              />
            </div>

            <button
              type="submit"
              className="bg-slate-900 hover:bg-black text-white py-3 px-10 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 active:scale-95"
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
