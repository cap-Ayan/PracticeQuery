import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState({
    title: '',
    price: '',
    description: '',
    category: '',
    image: '',
    discountPercentage: '', // New field
    discountEndTime: '', // New field
    quantity: '',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

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
        
          
          
        }
      } catch (err) {
        console.log("User not logged in");
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/products/getProductById/${id}`);
        const data = await res.json();
        const { title, price, description, category, image, discountPercentage, discountEndTime,quantity } = data.product; // Destructure all fields
        setProduct({ title, price, description, category, image, discountPercentage, discountEndTime,quantity });
        setLoading(false);
      } catch (error) {
        console.error('Error fetching product:', error);
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`http://localhost:5000/api/products/updateProduct/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product)
      });
      const result = await res.json();
      if (result.success) {
        alert('Product updated successfully!');
        navigate(`/productdetails/${id}`);
      } else {
        alert(result.message || 'Failed to update product.');
      }
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Server error while updating.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <p className="text-gray-600 text-lg">Loading product...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center px-4 w-full">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-md w-full max-w-2xl space-y-6 text-black/60"
      >
        <h2 className="text-2xl font-bold text-gray-800">Edit Product</h2>

        {['title', 'price', 'description', 'category', 'image', 'discountPercentage', 'discountEndTime', 'quantity'].map((field) => (
          <div key={field} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 capitalize">{field}</label>
            {field === 'description' ? (
              <textarea
                name={field}
                value={product[field]}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-4 py-2 resize-none"
                rows="4"
                required
                
              />
            ) : field === 'discountEndTime' ? (
              <input type="datetime-local" name={field} value={product[field]} onChange={handleChange} className="w-full border border-gray-300 rounded-md px-4 py-2" />
            ) : field === 'discountPercentage' ? (
              <input type="number" name={field} value={product[field]} onChange={handleChange} className="w-full border border-gray-300 rounded-md px-4 py-2" />
            ) : ( 
              <input 
                type={field === 'price'|| field === 'quantity'? 'number' : 'text'}
                name={field}
                value={product[field]}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-4 py-2"
                required
              />

            )}
          </div>
        ))}

        <button
          type="submit"
          disabled={saving}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-md font-semibold transition"
        >
          {saving ? 'Saving...' : 'Update Product'}
        </button>
      </form>
    </div>
  );
};

export default EditProduct;