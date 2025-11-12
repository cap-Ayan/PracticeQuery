import React, { useState, useMemo, useEffect } from "react";
import { useShopContext } from "../context/Context";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const Home = () => {
  const products = useShopContext();
  const [page, setPage] = useState(1);
  const [limitPerPage, setLimitPerPage] = useState(5);
  const location = useLocation();
  const navigate = useNavigate();
  const [reviewStats, setReviewStats] = useState({}); // { productId: { avg, count } }

  const deleteItem = (id) => {
    try {
      axios
        .delete(`http://localhost:5000/api/products/deleteProduct/${id}`)
        .then(() => {
          alert("Item deleted successfully");
          window.location.reload();
        });
    } catch (error) {
      alert("Error deleting item");
      console.error(error);
    }
  };

  // handle query params
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const lp = params.get("lpp");
    const pageParam = params.get("page");
    pageParam && setPage(Number(pageParam));
    lp && setLimitPerPage(Number(lp));
  }, [location.search]);

  const totalPages = Math.ceil(products.length / limitPerPage);

  const currentItems = useMemo(() => {
    const startIndex = (page - 1) * limitPerPage;
    const endIndex = startIndex + limitPerPage;
    return products.slice(startIndex, endIndex);
  }, [products, page, limitPerPage]);

  // Fetch reviews for all products
  useEffect(() => {
    const fetchAllReviews = async () => {
      try {
        const stats = {};

        await Promise.all(
          products.map(async (p) => {
            const res = await axios.get(
              `http://localhost:5000/api/reviews/getReviews/${p._id}`
            );
            const data = res.data;
            if (data.success && data.reviews.length > 0) {
              const avg =
                data.reviews.reduce((sum, r) => sum + (r.rating || 0), 0) /
                data.reviews.length;
              stats[p._id] = {
                avg: avg.toFixed(1),
                count: data.reviews.length,
              };
            } else {
              stats[p._id] = { avg: 0, count: 0 };
            }
          })
        );

        setReviewStats(stats);
      } catch (err) {
        console.error("Error fetching reviews:", err);
      }
    };

    if (products.length > 0) fetchAllReviews();
  }, [products]);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Products</h2>

      {/* Product grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {currentItems.map((item) => {
          const review = reviewStats[item._id] || { avg: 0, count: 0 };
          const stars = Math.round(review.avg);

          return (
            <div
              key={item._id}
              className="bg-white rounded-lg shadow-md p-3 cursor-pointer hover:shadow-lg transition"
              onClick={() => navigate(`/productdetails/${item._id}`)}
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-40 object-contain mb-4"
              />
              <h2 className="text-base font-semibold mb-1 truncate">
                {item.title}
              </h2>
              <p className="text-sm text-gray-600 mb-2 truncate">
                {item.description}
              </p>

              {/* Rating section */}
              <div className="flex items-center mb-2">
                {Array.from({ length: 5 }, (_, i) => (
                  <span
                    key={i}
                    className={`text-lg ${
                      i < stars ? "text-yellow-500" : "text-gray-300"
                    }`}
                  >
                    ★
                  </span>
                ))}
                <span className="ml-1 text-sm text-gray-600">
                  ({review.count})
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-blue-600 font-bold">${item.price}</span>

                <div className="flex flex-col items-end space-y-1">
                  <button className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm">
                    Add to Cart
                  </button>

                  <button
                    className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 text-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteItem(item._id);
                    }}
                  >
                    Remove
                  </button>

                  <button
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 text-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/editProducts/${item._id}`);
                    }}
                  >
                    Edit
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-6 space-x-2">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="px-3 py-1 border rounded disabled:opacity-50 bg-gray-400"
        >
          Prev
        </button>

        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index}
            onClick={() => setPage(index + 1)}
            className={`px-3 py-1 border rounded ${
              page === index + 1 ? "bg-blue-500 text-white" : "bg-gray-300"
            }`}
          >
            {index + 1}
          </button>
        ))}

        <button
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
          className="px-3 py-1 border rounded disabled:opacity-50 bg-gray-400"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Home;
