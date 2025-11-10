import React, { createContext, useEffect, useState, useContext } from 'react';
import { useLocation } from 'react-router-dom';

export const ShopContext = createContext(null);

export const ShopContextProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const location = useLocation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // ✅ read query param from URL
        const params = new URLSearchParams(location.search);
        const limit = params.get("limit"); // e.g. ?limit=10

        // ✅ fetch from fakestoreapi (limit optional)
        const url = limit
          ? `https://fakestoreapi.com/products?limit=${limit}`
          : `https://fakestoreapi.com/products`;

        const res = await fetch(url);
        const json = await res.json();
        setCartItems(json);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [location.search]); // re-run if query params change

  return (
    <ShopContext.Provider value={cartItems}>
      {children}
    </ShopContext.Provider>
  );
};

export const useShopContext = () => useContext(ShopContext);
