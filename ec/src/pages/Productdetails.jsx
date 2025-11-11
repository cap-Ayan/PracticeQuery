import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const Productdetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/products/getProductById/${id}`);
        const data = await res.json();
        setProduct(data.product);
        console.log(data.product);
      } catch (error) {
        console.error("Error fetching product details:", error);
      }
    };
    fetchProduct();
  }, [id]);

  if (!product) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <p className="text-gray-600 text-lg">Loading product details...</p>
      </div>
    );
  }

  return (
   <div className="bg-white h-screen flex justify-center w-screen overflow-hidden items-center">
  <div className="w-full max-w-7xl h-full flex flex-col md:flex-row items-center  gap-10 md:gap-20  ">

    {/* Product Image */}
    <div className="flex justify-center items-center w-full md:w-[45%]">
      <img
        src={product.image}
        alt={product.title}
        className="w-72 h-72 sm:w-80 sm:h-80 md:w-full md:h-[400px] object-contain rounded-2xl shadow-lg transition-transform duration-300 hover:scale-105"
      />
    </div>

    {/* Product Details */}
    <div className="flex flex-col justify-center md:justify-start w-full md:w-[45%] space-y-4">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{product.title}</h1>

      <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
        {product.description}
      </p>

      <p className="text-base sm:text-lg text-gray-700">
        <span className="font-semibold">Category:</span> {product.category}
      </p>

      <p className="text-xl sm:text-2xl font-bold text-green-600">₹{product.price}</p>

      {product.rating && (
        <p className="text-yellow-500 font-medium">
          ⭐ {product.rating.rate || product.rating}/5
        </p>
      )}

      <button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-xl text-sm sm:text-base font-semibold shadow-md transition-all duration-200">
        Add to Cart
      </button>
    </div>
  </div>
</div>

  );
};

export default Productdetails;


