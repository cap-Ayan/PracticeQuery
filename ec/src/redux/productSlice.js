import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchProducts = createAsyncThunk('products/fetchProducts', async (limit) => {
  const url = limit
    ? `http://localhost:3000/api/products?limit=${limit}`
    : `http://localhost:3000/api/products`;
  const response = await fetch(url);
  const json = await response.json();
  console.log('API Response:', json);

  // Get products array (handle both {products: [...]} and direct array)
  const productsArray = json.products || json;

 
  return productsArray;
});

const productSlice = createSlice({
  name: 'products',
  initialState: {
    items: [],
    status: 'idle', // idle | loading | succeeded | failed
    error: null,
  },
  reducers: {
    setProducts: (state, action) => {
      state.items = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        console.log('Setting products in Redux:', action.payload);
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { setProducts } = productSlice.actions;
export default productSlice.reducer;
