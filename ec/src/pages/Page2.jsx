import React from 'react'
import { useShopContext } from '../context/Context';

const Page2 = () => {
  const products = useShopContext();

  if (!products) return <div>Loading...</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {products.slice(10, 20).map((product) => (
        <div key={product.id} className="bg-white rounded-lg shadow-md p-4">
          <img 
            src={product.image} 
            alt={product.title}
            className="w-full h-48 object-contain mb-4"
          />
          <h2 className="text-lg font-semibold mb-2 truncate">{product.title}</h2>
          <p className="text-gray-600 mb-2 truncate">{product.description}</p>
          <div className="flex justify-between items-center">
            <div className="flex items-center text-black/80">
  {Array.from({ length: 5 }, (_, i) => (
    <span key={i} className={`mr-1 ${i < Math.round(product.rating.rate) ? 'text-yellow-500' : 'text-gray-300'}`}>
      ★
    </span>
  ))}
  <span className="ml-1 text-sm text-gray-600">({product.rating.count})</span>
</div>
            <span className="text-blue-600 font-bold">${product.price}</span>
            <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              Add to Cart
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default Page2