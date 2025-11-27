import React, { useState, useMemo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../redux/productSlice";
import { fetchUser, logout } from "../redux/userSlice";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import VerificationBox from "../components/VerificationBox";
import UnverifiedPopup from "../components/UnverifiedPopup";


const Navbar = ({ user }) => {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [navOpen, setNavOpen] = useState(false);

  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      await axios.delete(
        "http://localhost:5000/api/users/logout",
        { withCredentials: true }
      );
      dispatch(logout());
      toast.success("Logout successful");
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200/60 px-4 sm:px-6 py-4 sticky top-0 z-50 animate-fade-in transition-all duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <h1
          className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600 cursor-pointer hover:opacity-80 transition-opacity tracking-tight"
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

        <div className="hidden md:flex items-center space-x-8 relative">
          <button
            onClick={() => navigate("/")}
            className="text-slate-600 hover:text-indigo-600 font-semibold text-sm uppercase tracking-wide transition-colors duration-200"
          >
            Home
          </button>


          <button
            onClick={() => navigate("/cart")}
            className="text-slate-600 hover:text-indigo-600 font-semibold text-sm uppercase tracking-wide transition-colors duration-200"
          >
            Cart
          </button>


          {/* Profile Section */}
          <div className="relative">
            {user ? (
              <>
                <div
                  onClick={() => setShowMenu(!showMenu)}
                  className="bg-gradient-to-r from-slate-800 to-slate-900 text-white font-bold w-10 h-10 flex items-center justify-center rounded-full cursor-pointer select-none shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 ring-2 ring-offset-2 ring-indigo-500/50"
                >
                  {user.userName?.charAt(0).toUpperCase()}
                </div>

                {/* Dropdown Menu */}
                {showMenu && (
                  <div className="absolute right-0 mt-3 w-56 bg-white/90 backdrop-blur-xl shadow-2xl rounded-2xl border border-slate-100 py-2 animate-scale-in overflow-hidden z-50">
                    <div className="px-5 py-3 border-b border-slate-100 bg-slate-50/50">
                      <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-0.5">Signed in as</p>
                      <p className="text-slate-900 font-bold truncate">{user.userName}</p>
                    </div>
                    <button
                      onClick={() => {
                        navigate("/profile");
                        setShowMenu(false);
                      }}
                      className="block w-full text-left px-5 py-3 text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors duration-150 font-medium flex items-center gap-2"
                    >
                      <span>👤</span> Profile
                    </button>
                    <button
                      onClick={() => {
                        handleLogout();
                        setShowMenu(false);
                      }}
                      className="block w-full text-left px-5 py-3 text-red-600 hover:bg-red-50 transition-colors duration-150 font-medium flex items-center gap-2"
                    >
                      <span>🚪</span> Logout
                    </button>
                  </div>
                )}
              </>
            ) : (
              <button
                onClick={() => navigate("/signin")}
                className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2 rounded-full font-semibold shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {navOpen && (
        <div className="md:hidden mt-4 space-y-3 px-2 animate-fade-in">
          <button
            onClick={() => {
              navigate("/");
              setNavOpen(false);
            }}
            className="w-full text-left text-slate-900 font-medium px-4 py-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition"
          >
            Home
          </button>
          <button
            onClick={() => {
              navigate("/cart");
              setNavOpen(false);
            }}
            className="w-full text-left text-slate-900 font-medium px-4 py-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition"
          >
            Cart
          </button>
          <div className="border-t border-slate-200 pt-3">
            {user ? (
              <div className="space-y-2">
                <div className="px-4 py-2">
                  <p className="text-slate-500 text-xs uppercase font-bold">Signed in as</p>
                  <p className="text-slate-900 font-bold">{user.userName}</p>
                </div>
                <button
                  onClick={() => {
                    navigate("/profile");
                    setNavOpen(false);
                  }}
                  className="w-full text-left text-slate-900 font-medium px-4 py-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition"
                >
                  Profile
                </button>
                <button
                  onClick={() => {
                    handleLogout();
                    setNavOpen(false);
                  }}
                  className="w-full text-left text-red-600 font-medium px-4 py-3 rounded-xl bg-red-50 hover:bg-red-100 transition"
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
                className="w-full text-left text-white font-bold px-4 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 transition shadow-md"
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
  const dispatch = useDispatch();
  const products = useSelector((state) => state.products.items);

  const user = useSelector((state) => state.user.userInfo);
  const [page, setPage] = useState(1);
  const [limitPerPage, setLimitPerPage] = useState(8); // Increased limit for better grid view
  const [reviewStats, setReviewStats] = useState({});
  const location = useLocation();
  const navigate = useNavigate();
  const [showUnverifiedPopup, setShowUnverifiedPopup] = useState(false);


  const [selectedBrand, setSelectedBrand] = useState("All");

  // Sync context → local products
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const limit = params.get("limit");
    dispatch(fetchProducts(limit));
  }, [dispatch, location.search]);

  // Fetch user details using token
  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);
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

  // Derive unique brands from product titles
  const uniqueBrands = useMemo(() => {
    const result = [];
    const seen = new Set();

    for (const p of products) {
      const brandName = p.Brand?.name || "Generic";
      const brandLogo = p.Brand?.image || null;

      if (!seen.has(brandName)) {
        seen.add(brandName);
        result.push({ name: brandName, logo: brandLogo });
      }
    }

    return [{ name: "All", logo: null }, ...result];
  }, [products]);



  // Filter products based on selected brand
  const filteredProducts = useMemo(() => {
    if (selectedBrand === "All") return products;
    return products.filter(p => (p.Brand?.name || "Generic") === selectedBrand);
  }, [products, selectedBrand]);


  // Reset page when filter changes
  useEffect(() => {
    setPage(1);
  }, [selectedBrand]);

  const totalPages = Math.ceil(filteredProducts.length / limitPerPage);

  const currentItems = useMemo(() => {
    const startIndex = (page - 1) * limitPerPage;
    const endIndex = startIndex + limitPerPage;
    return filteredProducts.slice(startIndex, endIndex);
  }, [filteredProducts, page, limitPerPage]);

  // Fetch reviews
  // useEffect(() => {
  //   const fetchAllReviews = async () => {
  //     try {
  //       const stats = {};

  //       await Promise.all(
  //         products.map(async (p) => {
  //           const res = await axios.get(
  //             `http://localhost:5000/api/reviews/getReviews/${p._id}`
  //           );
  //           const data = res.data;
  //           if (data.success && data.reviews.length > 0) {
  //             const avg =
  //               data.reviews.reduce((sum, r) => sum + (r.rating || 0), 0) /
  //               data.reviews.length;
  //             stats[p._id] = {
  //               avg: avg.toFixed(1),
  //               count: data.reviews.length,
  //             };
  //           } else {
  //             stats[p._id] = { avg: 0, count: 0 };
  //           }
  //         })
  //       );

  //       setReviewStats(stats);
  //     } catch (err) {
  //       console.error("Error fetching reviews:", err);
  //     }
  //   };

  //   if (products.length > 0) fetchAllReviews();
  // }, [products]);

  return (
    <div className="bg-slate-50 min-h-screen font-sans">
      {/* Navbar */}
      <Navbar user={user} />
      {showVerificationBox && (
        <VerificationBox email={user.email} setShowVerificationBox={setShowVerificationBox} />
      )}

      {showUnverifiedPopup && (
        <UnverifiedPopup setShowUnverifiedPopup={setShowUnverifiedPopup} user={user} />
      )}

      {/* Hero Section */}
      <div className="relative bg-slate-900 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-900 to-purple-900 opacity-90"></div>
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1557821552-17105176677c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2089&q=80')] bg-cover bg-center mix-blend-overlay opacity-20"></div>
        </div>
        <div className="relative max-w-7xl mx-auto py-24 px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight mb-6 animate-fade-in-up">
            Discover <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Premium</span> Quality
          </h1>
          <p className="mt-4 text-xl text-slate-300 max-w-2xl mx-auto animate-fade-in-up animation-delay-200">
            Explore our curated collection of top-tier products designed to elevate your lifestyle.
          </p>
          <div className="mt-10 animate-fade-in-up animation-delay-400">
            <button
              onClick={() => document.getElementById('products-section').scrollIntoView({ behavior: 'smooth' })}
              className="bg-white text-slate-900 font-bold px-8 py-4 rounded-full shadow-xl hover:shadow-2xl hover:bg-slate-100 transition-all duration-300 transform hover:-translate-y-1"
            >
              Shop Now
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div id="products-section" className="p-6 sm:p-8 max-w-7xl mx-auto py-16">
        <div className="flex flex-col md:flex-row items-center justify-between mb-10 gap-6">
          <h2 className="text-3xl font-bold text-slate-900 animate-slide-in flex items-center gap-3">
            <span className="w-2 h-8 bg-indigo-600 rounded-full block"></span>
            Latest Products
          </h2>

          {/* Brand Filter */}
          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            {uniqueBrands.map((brand) => (
              <button
                key={brand.name}
                onClick={() => setSelectedBrand(brand.name)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all duration-200 border ${selectedBrand === brand.name
                    ? "bg-slate-900 text-white border-slate-900 shadow-md"
                    : "bg-white text-slate-600 border-slate-200 hover:bg-slate-100 hover:text-slate-900"
                  }`}
              >
                {brand.logo && (
                  <img
                    src={brand.logo}
                    alt={brand.name}
                    className="w-5 h-5 object-contain rounded-full bg-white"
                  />
                )}
                {brand.name}
              </button>
            ))}
          </div>
        </div>

        {/* Product grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {currentItems.map((item, index) => {
            const review = reviewStats[item._id] || { avg: 0, count: 0 };
            const stars = Math.round(review.avg);

            return (
              <div
                key={item.id}
                className="bg-white rounded-3xl shadow-sm border border-slate-100 p-4 cursor-pointer hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group animate-fade-in flex flex-col h-full"
                style={{ animationDelay: `${index * 0.05}s` }}
                onClick={() => navigate(`/productdetails/${item._id}`)}
              >
                <div className="relative overflow-hidden rounded-2xl mb-5 bg-slate-50 aspect-[4/3] flex items-center justify-center group-hover:bg-slate-100 transition-colors">
                  <img
                    src={`http://localhost:3000/${item.image}`}
                    alt={item.title}
                    className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-500 mix-blend-multiply"
                  />
                  {item.discountPercentage > 0 && (
                    <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-lg">
                      -{item.discountPercentage}%
                    </div>
                  )}
                </div>

                <div className="flex-1 flex flex-col">
                  <h2 className="text-lg font-bold mb-2 text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                    {item.title}
                  </h2>
                  <p className="text-sm text-slate-500 mb-4 line-clamp-2 flex-1">
                    {item.description}
                  </p>

                  {/* Rating */}
                  <div className="flex items-center mb-4">
                    <div className="flex items-center text-yellow-400">
                      {Array.from({ length: 5 }, (_, i) => (
                        <span key={i} className={`text-lg ${i < stars ? "opacity-100" : "opacity-30 text-slate-400"}`}>
                          ★
                        </span>
                      ))}
                    </div>
                    <span className="ml-2 text-xs font-medium text-slate-400">
                      ({review.count} reviews)
                    </span>
                  </div>

                  <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between gap-4">
                    <div className="flex flex-col">
                      {item.discountPercentage && item.discountPercentage > 0 ? (
                        <>
                          <span className="text-2xl font-extrabold text-slate-900">
                            ${(item.price - (item.price * item.discountPercentage) / 100).toFixed(2)}
                          </span>
                          <span className="text-xs text-slate-400 line-through font-medium">${item.price}</span>
                        </>
                      ) : (
                        <span className="text-2xl font-extrabold text-slate-900">${item.price}</span>
                      )}
                    </div>

                    {item.quantity > 0 ? (
                      <button
                        className="bg-slate-900 hover:bg-indigo-600 text-white p-3 rounded-xl shadow-lg hover:shadow-indigo-500/30 transition-all duration-300 transform active:scale-95 flex items-center justify-center group/btn"
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
                        }}
                        title="Add to Cart"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover/btn:animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                      </button>
                    ) : (
                      <span className="text-xs font-bold text-red-500 bg-red-50 px-3 py-1 rounded-full">Out of Stock</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-16 space-x-3">
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="px-5 py-2.5 border border-slate-200 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed bg-white hover:bg-slate-50 text-slate-700 font-bold shadow-sm hover:shadow transition-all duration-200"
            >
              ← Prev
            </button>

            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                onClick={() => setPage(index + 1)}
                className={`w-10 h-10 rounded-xl font-bold transition-all duration-200 flex items-center justify-center ${page === index + 1
                  ? "bg-slate-900 text-white shadow-lg scale-110"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:text-indigo-600"
                  }`}
              >
                {index + 1}
              </button>
            ))}

            <button
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
              className="px-5 py-2.5 border border-slate-200 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed bg-white hover:bg-slate-50 text-slate-700 font-bold shadow-sm hover:shadow transition-all duration-200"
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
