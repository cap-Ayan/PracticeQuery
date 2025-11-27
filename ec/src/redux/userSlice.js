import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchUser = createAsyncThunk('user/fetchUser', async () => {
    try {
        const response = await axios.get("http://localhost:5000/api/users/getUser", {
            withCredentials: true,
        });
        if (response.data.success) {
            return response.data.user;
        } else {
            return null; // User not found, return null instead of throwing
        }
    } catch (error) {
        // Handle 401 or other errors gracefully - user is not logged in
        if (error.response && error.response.status === 401) {
            return null; // User not authenticated, return null
        }
        throw error; // Re-throw other errors
    }
});

const userSlice = createSlice({
    name: 'user',
    initialState: {
        userInfo: null,
        status: 'idle',
        error: null,
    },
    reducers: {
        logout: (state) => {
            state.userInfo = null;
            state.status = 'idle';
        },
        setUser: (state, action) => {
            state.userInfo = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUser.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchUser.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.userInfo = action.payload;
            })
            .addCase(fetchUser.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    },
});

export const { logout, setUser } = userSlice.actions;
export default userSlice.reducer;
