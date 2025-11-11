import React, { useState } from 'react';
import axios from 'axios';

const Admin = () => {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [image, setImage] = useState('');
  const [ratingRate, setRatingRate] = useState('');
  const [ratingCount, setRatingCount] = useState('');

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

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-50">
      <div className="max-w-md w-full p-6 bg-white rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">Create New Product</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4 text-black/70">
          {/* Title and Price */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              id="title"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price</label>
              <input
                type="number"
                id="price"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </div>

          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              id="description"
              rows="3"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          {/* Category and Image URL */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
              <input
                type="text"
                id="category"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Image URL */}
          <div>
            <label htmlFor="image" className="block text-sm font-medium text-gray-700">Image URL</label>
            <input
              type="text"
              id="image"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              required
            />
          </div>

          {/* Rating Rate and Rating Count */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="ratingRate" className="block text-sm font-medium text-gray-700">Rating (Rate)</label>
              <input
                type="number"
                step="0.1"
                id="ratingRate"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                value={ratingRate}
                onChange={(e) => setRatingRate(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="ratingCount" className="block text-sm font-medium text-gray-700">Rating (Count)</label>
              <input
                type="number"
                id="ratingCount"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                value={ratingCount}
                onChange={(e) => setRatingCount(e.target.value)}
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold transition duration-200"
          >
            Create Product
          </button>
        </form>
      </div>
    </div>
  );
};

export default Admin;
