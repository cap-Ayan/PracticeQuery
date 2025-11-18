// src/App.jsx
import { useState, useEffect } from "react";
import { useNavigate ,useLocation} from "react-router-dom";
import { useShopContext } from "../context/Context";
import UnverifiedPopup from "../components/UnverifiedPopup";
import VerificationBox from "../components/VerificationBox";
import axios from "axios";
import { toast } from "react-toastify";
import { useMemo } from "react";


export default function AdminPanel() {
  const [showVerificationBox, setShowVerificationBox] = useState(false);
  const allProducts = useShopContext();
  const [products, setProducts] = useState(allProducts);
  const [page, setPage] = useState(1);
  const [limitPerPage, setLimitPerPage] = useState(5);
  const [user, setUser] = useState({});
  
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
  

  useEffect(() => setProducts(allProducts), [allProducts]);

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
  
 useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/users/getUser", {
          withCredentials: true, // use cookies to send token
        });
        if (res.data.success) {
          console.log(res.data.user)
          if(res.data.user.isAdmin==false){
               navigate("/");
              return
          }
          setUser(res.data.user);
          
          console.log(user)
        }
      } catch (err) {
        console.log("User not logged in");
      }
    };
    fetchUser();
  }, []);

  

  

  
 

  

  return (
      <div>
      {/* Navbar */}
      
      {showVerificationBox && (
           <VerificationBox email={user.email} setShowVerificationBox={setShowVerificationBox}/>
        )}

         {showUnverifiedPopup && (
        <UnverifiedPopup setShowUnverifiedPopup={setShowUnverifiedPopup} user={user} />
      )}

      {/* Main content */}
      <div className="p-6 sm:p-8 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-slate-900 animate-slide-in">Products</h2>

        {/* Add Product Button */}
        <div className="mb-8 text-right">
          <button
             onClick={async (e) => {
                        e.stopPropagation();
                        if(!user){
                          toast.error("Please login to edit products")
                          navigate("/signin")
                          return
                        }else{
                        if(user.isVerified==false){
                          try {
                            const res = await axios.post("http://localhost:5000/api/users/send",{email:user.email})
                            if(res.data.success){
                              setShowVerificationBox(true)
                            }
                            else{
                              toast.error(res.data.message)
                            }
                          } catch (error) {
                            toast.error(error.response.data.message)
                          }
                          
                        }else{
                        navigate(`/admin`);
                        }
                      }
                      }}
            className="bg-white border border-slate-300 text-slate-900 px-3 py-2 rounded-lg text-xs font-medium shadow-sm hover:shadow-md transition-all duration-200"
          >
            Add New Product
          </button>
        </div>

        {/* Product grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {currentItems.map((item, index) => {
            

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

               
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold text-slate-900">${item.price}</span>
                  </div>
                  <div className="flex gap-1.5">
                  
                    <button
                      className="bg-white border border-slate-300 text-slate-900 px-3 py-2 rounded-lg text-xs font-medium shadow-sm hover:shadow-md transition-all duration-200"
                      onClick={async (e) => {
                        e.stopPropagation();
                        if(!user){
                          toast.error("Please login to edit products")
                          navigate("/signin")
                          return
                        }else{
                        if(user.isVerified==false){
                          try {
                            const res = await axios.post("http://localhost:5000/api/users/send",{email:user.email})
                            if(res.data.success){
                              setShowVerificationBox(true)
                            }
                            else{
                              toast.error(res.data.message)
                            }
                          } catch (error) {
                            toast.error(error.response.data.message)
                          }
                          
                        }else{
                        navigate(`/editProducts/${item._id}`);
                        }
                      }
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-slate-100 text-slate-900 px-3 py-2 rounded-lg text-xs font-medium shadow-sm hover:shadow-md transition-all duration-200 border border-slate-200"
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
}
