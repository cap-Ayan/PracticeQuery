import React, { useState, useMemo, useEffect } from "react";
import { useShopContext } from "../context/Context";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";


const Navbar = ({ user, setUser }) => {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);

  const handleLogout = async () => {
    try {
      await axios.delete(
        "http://localhost:5000/api/users/logout",
        {},
        { withCredentials: true }
      );
      setUser(null);
      alert("Logged out successfully");
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <nav className="flex justify-between items-center bg-white shadow-md px-6 py-3 sticky top-0 z-10">
      <h1
        className="text-xl font-bold text-blue-600 cursor-pointer"
        onClick={() => navigate("/")}
      >
        🛒 ShopEase
      </h1>

      <div className="flex items-center space-x-4 relative">
        <button
          onClick={() => navigate("/")}
          className="text-gray-700 hover:text-blue-600 font-medium"
        >
          Home
        </button>

        <button
          onClick={() => navigate("/cart")}
          className="text-gray-700 hover:text-blue-600 font-medium"
        >
          Cart
        </button>

        {/* Profile Section */}
        <div className="relative">
          {user ? (
            <>
              <div
                onClick={() => setShowMenu(!showMenu)}
                className="bg-blue-500 text-white font-semibold w-10 h-10 flex items-center justify-center rounded-full cursor-pointer select-none"
              >
                {user.userName?.charAt(0).toUpperCase()}
              </div>

              {/* Dropdown Menu */}
              {showMenu && (
                <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-lg border py-2">
                  <p className="px-4 py-2 text-gray-800 font-medium border-b">
                    {user.name}
                  </p>
                  <button
                    onClick={() => navigate("/profile")}
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Profile
                  </button>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </>
          ) : (
            <div
              onClick={() => navigate("/signin")}
              className="bg-gray-200 hover:bg-gray-300 w-10 h-10 flex items-center justify-center rounded-full cursor-pointer"
              title="Sign In"
            >
              <span className="text-xl">👤</span>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
const Home = () => {
  const allProducts = useShopContext();
  const [products, setProducts] = useState(allProducts);
  const [page, setPage] = useState(1);
  const [limitPerPage, setLimitPerPage] = useState(5);
  const [user, setUser] = useState({});
  const [reviewStats, setReviewStats] = useState({});
  const location = useLocation();
  const navigate = useNavigate();

  // Sync context → local products
  useEffect(() => setProducts(allProducts), [allProducts]);

  // Fetch user details using token
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/users/getUser", {
          withCredentials: true, // use cookies to send token
        });
        if (res.data.success) {
          setUser(res.data.user);
        }
      } catch (err) {
        console.log("User not logged in");
      }
    };
    fetchUser();
  }, []);

  const deleteItem = async (id) => {
    try {
      await axios.delete(
        `http://localhost:5000/api/products/deleteProduct/${id}`
      );
      alert("Item deleted successfully");
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (error) {
      alert("Error deleting item");
      console.error(error);
    }
  };

  // Handle pagination query params
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

  // Fetch reviews
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
    <div>
      {/* Navbar */}
      <Navbar user={user} setUser={setUser} />

      {/* Main content */}
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

                {/* Rating */}
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

                <div className="flex justify-between items-center mt-2">
                  <span className="text-blue-600 font-bold">${item.price}</span>
                  <div className="flex space-x-1">
                    <button className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-xs">
                      Add to Cart
                    </button>
                    <button
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-2 py-1 rounded text-xs"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/editProducts/${item._id}`);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteItem(item._id);
                      }}
                    >
                      Remove
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
    </div>
  );
};

export default Home;
