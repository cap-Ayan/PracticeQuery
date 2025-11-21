import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { generateProductDetails } from '../utils/aiService';

const Admin = () => {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [image, setImage] = useState('');
  const [ratingRate, setRatingRate] = useState('');
  const [ratingCount, setRatingCount] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const navigate = useNavigate()


  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/users/getUser", {
          withCredentials: true, // use cookies to send token
        });
        if (res.data.success) {
          console.log(res.data.user)
          if (res.data.user.isAdmin == false) {
            navigate("/");
            return
          }
        }
      } catch (err) {
        console.log("User not logged in");
      }
    };
    fetchUser();
  }, []);



  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/products/addProduct', {
        title,
        price: parseFloat(price),
        description,
        category,
        image,
        rating: {
          rate: parseFloat(ratingRate),
          count: parseInt(ratingCount),
        },
      });

      alert(' Product created successfully!');
      console.log(res.data);

      // Clear form fields
      setTitle('');
      setPrice('');
      setDescription('');
      setCategory('');
      setImage('');
      setRatingRate('');
      setRatingCount('');
    } catch (error) {
      console.error('Error creating product:', error);
      alert(' Error creating product.');
    }
  };

  const handleGenerateAI = async () => {
    if (!title) {
      alert("Please enter a title first to generate details.");
      return;
    }

    setIsGenerating(true);
    try {
      const details = await generateProductDetails(title);
      setDescription(details.description);
      setImage(details.image);
      // Optionally set category if it's empty or you want to override
      if (!category) setCategory(details.category);

      alert("AI Generation Complete! Description and Image populated.");
    } catch (error) {
      console.error("AI Generation Error:", error);
      alert("Failed to generate details. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl w-full p-8 bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 animate-fade-in">
        <h2 className="text-3xl font-extrabold mb-8 text-center text-gray-900 tracking-tight">
          Create New Product
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6 text-gray-700">
          {/* Title */}
          <div className="group">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1 transition-colors group-focus-within:text-blue-600">Title</label>
            <div className="flex gap-3">
              <input
                type="text"
                id="title"
                className="block w-full rounded-xl border-gray-200 bg-gray-50/50 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-all duration-200 hover:bg-white p-2.5 border"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder="e.g. Wireless Headphones"
              />
              <button
                type="button"
                onClick={handleGenerateAI}
                disabled={isGenerating || !title}
                className={`px-6 py-2.5 rounded-xl font-semibold text-white shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 ${isGenerating || !title
                    ? 'bg-gray-300 cursor-not-allowed shadow-none'
                    : 'bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 hover:shadow-indigo-500/30'
                  }`}
              >
                {isGenerating ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="animate-pulse">Magic...</span>
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <span>✨</span>
                    <span>Auto-Fill</span>
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Price */}
          <div className="group">
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1 transition-colors group-focus-within:text-blue-600">Price</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">$</span>
              </div>
              <input
                type="number"
                id="price"
                className="block w-full pl-7 rounded-xl border-gray-200 bg-gray-50/50 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-all duration-200 hover:bg-white p-2.5 border"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                placeholder="0.00"
              />
            </div>
          </div>

          {/* Description */}
          <div className="group">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1 transition-colors group-focus-within:text-blue-600">Description</label>
            <textarea
              id="description"
              rows="4"
              className="block w-full rounded-xl border-gray-200 bg-gray-50/50 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-all duration-200 hover:bg-white resize-none p-2.5 border"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              placeholder="Product description..."
            />
          </div>

          {/* Category and Image URL */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="group">
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1 transition-colors group-focus-within:text-blue-600">Category</label>
              <input
                type="text"
                id="category"
                className="block w-full rounded-xl border-gray-200 bg-gray-50/50 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-all duration-200 hover:bg-white p-2.5 border"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
                placeholder="e.g. Electronics"
              />
            </div>
          </div>

          {/* Image URL */}
          <div className="group">
            <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1 transition-colors group-focus-within:text-blue-600">Image URL</label>
            <input
              type="text"
              id="image"
              className="block w-full rounded-xl border-gray-200 bg-gray-50/50 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-all duration-200 hover:bg-white p-2.5 border"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              required
              placeholder="https://..."
            />
          </div>

          {/* Rating Rate and Rating Count */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="group">
              <label htmlFor="ratingRate" className="block text-sm font-medium text-gray-700 mb-1 transition-colors group-focus-within:text-blue-600">Rating (Rate)</label>
              <input
                type="number"
                step="0.1"
                id="ratingRate"
                className="block w-full rounded-xl border-gray-200 bg-gray-50/50 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-all duration-200 hover:bg-white p-2.5 border"
                value={ratingRate}
                onChange={(e) => setRatingRate(e.target.value)}
                placeholder="0-5"
              />
            </div>

            <div className="group">
              <label htmlFor="ratingCount" className="block text-sm font-medium text-gray-700 mb-1 transition-colors group-focus-within:text-blue-600">Rating (Count)</label>
              <input
                type="number"
                id="ratingCount"
                className="block w-full rounded-xl border-gray-200 bg-gray-50/50 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-all duration-200 hover:bg-white p-2.5 border"
                value={ratingCount}
                onChange={(e) => setRatingCount(e.target.value)}
                placeholder="0"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-gray-900 hover:bg-black text-white py-3.5 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 active:translate-y-0 mt-4"
          >
            Create Product
          </button>
        </form>
      </div>
    </div>
  );
};

export default Admin;
