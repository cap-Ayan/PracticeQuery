import React, { useState, useMemo, useEffect } from "react";
import { useShopContext } from "../context/Context";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import VerificationBox from "../components/VerificationBox";
import UnverifiedPopup from "../components/UnverifiedPopup";


const Navbar = ({ user, setUser }) => {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [navOpen, setNavOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await axios.delete(
        "http://localhost:5000/api/users/logout",
        {},
        { withCredentials: true }
      );
      setUser(null);
      toast.success("Logout successful");
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <nav className="bg-white border-b border-slate-200 px-4 sm:px-6 py-4 sticky top-0 z-50 animate-fade-in">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <h1
          className="text-2xl font-semibold text-slate-900 cursor-pointer hover:opacity-80 transition-opacity"
          onClick={() => {
            navigate("/");
            setNavOpen(false);
          }}
        >
          🛒 ShopEase
        </h1>

        <button
          className="md:hidden p-2 rounded-lg border border-slate-200 text-slate-900 hover:bg-slate-100 transition"
          onClick={() => setNavOpen(!navOpen)}
          aria-label="Toggle navigation menu"
        >
          <span className="block w-5 h-0.5 bg-slate-900 mb-1"></span>
          <span className="block w-5 h-0.5 bg-slate-900 mb-1"></span>
          <span className="block w-5 h-0.5 bg-slate-900"></span>
        </button>

        <div className="hidden md:flex items-center space-x-6 relative">
          <button
            onClick={() => navigate("/")}
            className="text-slate-700 hover:text-slate-900 font-medium px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-all duration-200"
          >
            Home
          </button>

          <button
            onClick={() => navigate("/cart")}
            className="text-slate-700 hover:text-slate-900 font-medium px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-all duration-200"
          >
            Cart
          </button>

          {user && user.isAdmin && (
            <button
              onClick={() => navigate("/adminpnl")}
              className="text-slate-700 hover:text-slate-900 font-medium px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-all duration-200"
            >
              Dashboard
            </button>
          )}


          {/* Profile Section */}
          <div className="relative">
            {user ? (
              <>
                <div
                  onClick={() => setShowMenu(!showMenu)}
                  className="bg-slate-900 text-white font-semibold w-11 h-11 flex items-center justify-center rounded-full cursor-pointer select-none shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200"
                >
                  {user.userName?.charAt(0).toUpperCase()}
                </div>

                {/* Dropdown Menu */}
                {showMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white shadow-xl rounded-xl border border-slate-200 py-2 animate-scale-in overflow-hidden">
                    <p className="px-4 py-2.5 text-slate-900 font-semibold border-b border-slate-100 bg-slate-50">
                      {user.userName}
                    </p>
                    <button
                      onClick={() => {
                        navigate("/profile");
                        setShowMenu(false);
                      }}
                      className="block w-full text-left px-4 py-2.5 text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors duration-150"
                    >
                      Profile
                    </button>
                    <button
                      onClick={() => {
                        handleLogout();
                        setShowMenu(false);
                      }}
                      className="block w-full text-left px-4 py-2.5 text-slate-900 hover:bg-slate-100 transition-colors duration-150"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div
                onClick={() => navigate("/signin")}
                className="bg-slate-100 hover:bg-slate-200 w-11 h-11 flex items-center justify-center rounded-full cursor-pointer shadow-sm hover:shadow-md hover:scale-105 transition-all duration-200"
                title="Sign In"
              >
                <span className="text-xl">👤</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {navOpen && (
        <div className="md:hidden mt-4 space-y-3 px-2">
          <button
            onClick={() => {
              navigate("/");
              setNavOpen(false);
            }}
            className="w-full text-left text-slate-900 font-medium px-4 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 transition"
          >
            Home
          </button>
          <button
            onClick={() => {
              navigate("/cart");
              setNavOpen(false);
            }}
            className="w-full text-left text-slate-900 font-medium px-4 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 transition"
          >
            Cart
          </button>
          <div className="border-t border-slate-200 pt-3">
            {user ? (
              <div className="space-y-2">
                <p className="text-slate-600 text-sm">Signed in as</p>
                <p className="text-slate-900 font-semibold">{user.userName}</p>
                <button
                  onClick={() => {
                    navigate("/profile");
                    setNavOpen(false);
                  }}
                  className="w-full text-left text-slate-900 font-medium px-4 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 transition"
                >
                  Profile
                </button>
                <button
                  onClick={() => {
                    handleLogout();
                    setNavOpen(false);
                  }}
                  className="w-full text-left text-slate-900 font-medium px-4 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 transition"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  navigate("/signin");
                  setNavOpen(false);
                }}
                className="w-full text-left text-slate-900 font-medium px-4 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 transition"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
const Home = () => {
  const [showVerificationBox, setShowVerificationBox] = useState(false);
  const allProducts = useShopContext();
  const [products, setProducts] = useState(allProducts);
  const [page, setPage] = useState(1);
  const [limitPerPage, setLimitPerPage] = useState(5);
  const [user, setUser] = useState({});
  const [reviewStats, setReviewStats] = useState({});
  const location = useLocation();
  const navigate = useNavigate();
   const [showUnverifiedPopup, setShowUnverifiedPopup] = useState(false);


  // Sync context → local products
  useEffect(() => {setProducts(allProducts)
    console.log(allProducts)
  }, [allProducts]);

  // Fetch user details using token
  useEffect(() => {
    
    const fetchUser = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/users/getUser", {
          withCredentials: true, // use cookies to send token
        });
        if (res.data.success) {
          console.log(res.data.user)
          setUser(res.data.user);
          console.log(user)
        }
      } catch (err) {
        console.log("User not logged in");
      }
    };
    fetchUser();
  }, []);
  useEffect(() => {
  if (user && user.email) {
    if (user.isVerified === false) {
      setShowUnverifiedPopup(true);
    } else {
      setShowUnverifiedPopup(false);
    }
  }
}, [user]);

  

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
      {showVerificationBox && (
           <VerificationBox email={user.email} setShowVerificationBox={setShowVerificationBox}/>
        )}

         {showUnverifiedPopup && (
        <UnverifiedPopup setShowUnverifiedPopup={setShowUnverifiedPopup} user={user} />
      )}

      {/* Main content */}
      <div className="p-6 sm:p-8 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-slate-900 animate-slide-in">Products</h2>

        {/* Product grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {currentItems.map((item, index) => {
            const review = reviewStats[item._id] || { avg: 0, count: 0 };
            const stars = Math.round(review.avg);

            return (
              <div
                key={item._id}
                className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group animate-fade-in"
                style={{ animationDelay: `${index * 0.05}s` }}
                onClick={() => navigate(`/productdetails/${item._id}`)}
              >
                <div className="relative overflow-hidden rounded-xl mb-4 bg-slate-50 aspect-square flex items-center justify-center">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <h2 className="text-base font-semibold mb-1.5 truncate text-slate-900 group-hover:text-slate-900 transition-colors">
                  {item.title}
                </h2>
                <p className="text-sm text-slate-500 mb-3 truncate line-clamp-2">
                  {item.description}
                </p>

                {/* Rating */}
                <div className="flex items-center mb-3">
                  <div className="flex items-center">
                    {Array.from({ length: 5 }, (_, i) => (
                      <span
                        key={i}
                        className={`text-sm ${
                          i < stars ? "text-slate-800" : "text-slate-300"
                        } transition-colors`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <span className="ml-2 text-xs text-slate-500">
                    ({review.count})
                  </span>
                </div>

                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    {item.discountPercentage
 && item.discountPercentage> 0 && item.discountEndTime&& new Date(item.discountEndTime) > new Date() ? (
                      <>
                        <span className="text-xl font-bold text-red-600">
                          ${(item.price - (item.price * item.discountPercentage) / 100).toFixed(2)}
                        </span>
                        <span className="text-sm text-slate-500 line-through ml-2">${item.price}</span>
                        <span className="text-xs text-green-600 ml-2">
                          {item.discountPercentage}% off
                        </span>
                      </>
                    ) : (
                      <span className="text-xl font-bold text-slate-900">${item.price}</span>
                    )}
                  </div>
                  <div className="flex gap-1.5">
                    <button 
                      className="flex-1 bg-slate-900 hover:bg-black text-white px-3 py-2 rounded-lg text-xs font-medium shadow-sm hover:shadow-md transition-all duration-200"
                       onClick={async (e) => {
                          e.stopPropagation();
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
                                productId: item._id,
                                quantity: 1, // Default quantity
                              },
                              { withCredentials: true }
                            );
                            if (res.data.success) {
                              toast.success("Item added to cart!");
                            } else {
                              toast.error(res.data.message || "Failed to add item to cart.");
                            }
                          } catch (error) {
                            console.error("Error adding to cart:", error);
                            toast.error("Server error while adding item to cart.");
                          }
                        }}
                    >
                      Add to Cart
                    </button>
                  
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Pagination */}
        <div className="flex justify-center items-center mt-10 space-x-2">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="px-4 py-2 border border-slate-300 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed bg-white hover:bg-slate-50 text-slate-700 font-medium shadow-sm hover:shadow transition-all duration-200 disabled:hover:bg-white"
          >
            Prev
          </button>

          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              onClick={() => setPage(index + 1)}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                page === index + 1
                  ? "bg-slate-900 text-white shadow-md scale-105"
                  : "bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 shadow-sm hover:shadow"
              }`}
            >
              {index + 1}
            </button>
          ))}

          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            className="px-4 py-2 border border-slate-300 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed bg-white hover:bg-slate-50 text-slate-700 font-medium shadow-sm hover:shadow transition-all duration-200 disabled:hover:bg-white"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
