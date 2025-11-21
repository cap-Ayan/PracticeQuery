// src/App.jsx
import { useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../redux/productSlice";
import { fetchUser } from "../redux/userSlice";
import UnverifiedPopup from "../components/UnverifiedPopup";
import VerificationBox from "../components/VerificationBox";
import axios from "axios";
import { toast } from "react-toastify";

export default function AdminPanel() {
  const [showVerificationBox, setShowVerificationBox] = useState(false);
  const dispatch = useDispatch();
  const products = useSelector((state) => state.products.items);
  const user = useSelector((state) => state.user.userInfo);
  const [page, setPage] = useState(1);
  const [limitPerPage, setLimitPerPage] = useState(8); // Increased limit for better grid

  const location = useLocation();
  const navigate = useNavigate();
  const [showUnverifiedPopup, setShowUnverifiedPopup] = useState(false);

  useEffect(() => {
    if (user && user.email) {
      if (user.isVerified === false) {
        setShowUnverifiedPopup(true);
      } else {
        setShowUnverifiedPopup(false);
      }
    }
  }, [user]);


  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const limit = params.get("limit");
    dispatch(fetchProducts(limit));
  }, [dispatch, location.search]);

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

  const deleteItem = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await axios.delete(
        `http://localhost:5000/api/products/deleteProduct/${id}`
      );
      toast.success("Item deleted successfully");
      dispatch(fetchProducts());
    } catch (error) {
      toast.error("Error deleting item");
      console.error(error);
    }
  };

  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);

  useEffect(() => {
    if (user && user.isAdmin === false) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleAddProduct = async (e) => {
    e.stopPropagation();
    if (!user) {
      toast.error("Please login to edit products")
      navigate("/signin")
      return
    } else {
      if (user.isVerified == false) {
        try {
          const res = await axios.post("http://localhost:5000/api/users/send", { email: user.email })
          if (res.data.success) {
            setShowVerificationBox(true)
          }
          else {
            toast.error(res.data.message)
          }
        } catch (error) {
          toast.error(error.response.data.message)
        }

      } else {
        navigate(`/admin`);
      }
    }
  };

  const handleEditProduct = async (e, itemId) => {
    e.stopPropagation();
    if (!user) {
      toast.error("Please login to edit products")
      navigate("/signin")
      return
    } else {
      if (user.isVerified == false) {
        try {
          const res = await axios.post("http://localhost:5000/api/users/send", { email: user.email })
          if (res.data.success) {
            setShowVerificationBox(true)
          }
          else {
            toast.error(res.data.message)
          }
        } catch (error) {
          toast.error(error.response.data.message)
        }

      } else {
        navigate(`/editProducts/${itemId}`);
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans animate-fade-in">
      {/* Navbar */}

      {showVerificationBox && (
        <VerificationBox email={user.email} setShowVerificationBox={setShowVerificationBox} />
      )}

      {showUnverifiedPopup && (
        <UnverifiedPopup setShowUnverifiedPopup={setShowUnverifiedPopup} user={user} />
      )}

      {/* Main content */}
      <div className="p-6 sm:p-10 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-10 gap-4">
          <div>
            <h2 className="text-4xl font-extrabold text-slate-900 animate-slide-in">Admin Dashboard</h2>
            <p className="text-slate-500 mt-2">Manage your products and inventory</p>
          </div>

          <button
            onClick={handleAddProduct}
            className="bg-slate-900 hover:bg-indigo-600 text-white px-6 py-3 rounded-xl text-sm font-bold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 active:translate-y-0 flex items-center gap-2 animate-slide-in"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Add New Product
          </button>
        </div>

        {/* Product grid */}
        {currentItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {currentItems.map((item, index) => (
              <div
                key={item._id}
                className="bg-white rounded-3xl shadow-sm border border-slate-100 p-5 cursor-pointer hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group animate-fade-in flex flex-col h-full relative overflow-hidden"
                style={{ animationDelay: `${index * 0.05}s` }}
                onClick={() => navigate(`/productdetails/${item._id}`)}
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                <div className="relative overflow-hidden rounded-2xl mb-5 bg-slate-50 aspect-[4/3] flex items-center justify-center group-hover:bg-indigo-50/30 transition-colors duration-300">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-500 mix-blend-multiply"
                  />
                  {item.discountPercentage > 0 && (
                    <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-sm">
                      -{item.discountPercentage}%
                    </div>
                  )}
                </div>

                <div className="flex-1 flex flex-col">
                  <div className="mb-1">
                    <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider bg-indigo-50 px-2 py-0.5 rounded-md">
                      {item.category}
                    </span>
                  </div>
                  <h2 className="text-lg font-bold mb-2 text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                    {item.title}
                  </h2>
                  <p className="text-sm text-slate-500 mb-4 line-clamp-2 leading-relaxed flex-1">
                    {item.description}
                  </p>

                  <div className="mt-auto pt-4 border-t border-slate-100 flex flex-col gap-4">
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-extrabold text-slate-900">₹{item.price}</span>
                      <div className="flex items-center text-yellow-400 text-sm font-bold">
                        <span>★</span>
                        <span className="text-slate-700 ml-1">4.5</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <button
                        className="bg-white border-2 border-slate-200 text-slate-700 hover:border-indigo-600 hover:text-indigo-600 px-3 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 flex items-center justify-center gap-1"
                        onClick={(e) => handleEditProduct(e, item._id)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                        Edit
                      </button>
                      <button
                        className="bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 px-3 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 flex items-center justify-center gap-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteItem(item._id);
                        }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 000-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">No products found</h3>
            <p className="text-slate-500 mb-6">Get started by adding your first product.</p>
            <button
              onClick={handleAddProduct}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg transition-all"
            >
              Add Product
            </button>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-12 space-x-3">
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="px-5 py-2.5 border border-slate-200 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed bg-white hover:bg-slate-50 text-slate-700 font-bold shadow-sm hover:shadow transition-all duration-200 flex items-center gap-1"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Prev
            </button>

            <div className="flex items-center gap-2 bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index}
                  onClick={() => setPage(index + 1)}
                  className={`w-10 h-10 rounded-lg font-bold transition-all duration-200 flex items-center justify-center ${page === index + 1
                    ? "bg-slate-900 text-white shadow-md scale-105"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>

            <button
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
              className="px-5 py-2.5 border border-slate-200 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed bg-white hover:bg-slate-50 text-slate-700 font-bold shadow-sm hover:shadow transition-all duration-200 flex items-center gap-1"
            >
              Next
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
