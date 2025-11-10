import React, { useState, useMemo, useEffect } from "react";
import { useShopContext } from "../context/Context";
import { useLocation } from "react-router-dom";

const Home = () => {
  const products = useShopContext();
  const [page, setPage] = useState(1);
  const [limitPerPage,setLimitPerPage]=useState(5);
  const location=useLocation();

  

  useEffect(()=>{
     const params= new URLSearchParams(location.search);
     const lp=params.get("lpp")//define how many elemeents you want to show on your website 
     const page=params.get("page")//define which page you want to show on your website
     page&&setPage(Number(page))
     lp&&setLimitPerPage(Number(lp))
  },[location.search])
  


  // 🧮 Calculate total pages dynamically based on items count
  const totalPages = Math.ceil(products.length / limitPerPage);

  // 🧩 Get only items for current page
  const currentItems = useMemo(() => {

    
    const startIndex = (page - 1) * limitPerPage;
    const endIndex = startIndex + limitPerPage;
    return products.slice(startIndex, endIndex);
  }, [products, page]);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Products</h2>

      {/* Show products */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {currentItems.map((item) => (
          <div key={item.id} className="bg-white rounded-lg shadow-md p-3">
          <img 
            src={item.image} 
            alt={item.title}
            className="w-full h-40 object-contain mb-4"
          />
          <h2 className="text-base font-semibold mb-2 truncate">{item.title}</h2>
          <p className="text-sm text-gray-600 mb-2 truncate">{item.description}</p>
          <div className="flex justify-between items-center">
            <div className="flex items-center text-black/80">
  {Array.from({ length: 5 }, (_, i) => (
    <span key={i} className={`mr-[0.5] ${i < Math.round(item.rating.rate) ? 'text-yellow-500' : 'text-gray-300'}`}>
      ★
    </span>
  ))}
  <span className="ml-1 text-sm text-gray-600">({item.rating.count})</span>
</div>
            <span className="text-blue-600 font-bold">${item.price}</span>
            <button className="bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600 text-sm">
              Add to Cart
            </button>
          </div>
        </div>
        ))}
      </div>

      {/* Pagination Controls */}
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
            className={`px-3 py-1 border rounded bg-gray-300 ${
              page === index + 1 ? "bg-blue-500 text-white" : ""
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
