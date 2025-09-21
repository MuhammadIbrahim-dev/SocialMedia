import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { axiosIstance } from "../../../axios";

// ----------------------get_current_user--------------------------
export const CurrentUser = createAsyncThunk(
    'auth/CurrentUser', async (_, { rejectWithValue }) => {
        try {
            const res = await axiosIstance.get('/auth/check-user');
            return res.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch current user');
        }
    }
);
//---------------------------get_All_users----------------------------
export const GetAllUsers = createAsyncThunk(
    'auth/GetAllUsers', async (_) => {
        try {
            const res = await axiosIstance.get('/auth/users');
            console.log('All users Data',res.data);
            
            return res.data;
        
        } catch (error) {
            console.log(error);
            throw error; // Let createAsyncThunk handle the rejection
        }
    }
);
// ----------------------------signup-----------------------------
export const Signup = createAsyncThunk(
    'auth/signup', async (userData, { rejectWithValue }) => {
        try {
            const { data } = await axiosIstance.post('/auth/signup', userData);
            return data;
        } catch (error) {
            // Use rejectWithValue to pass a specific error payload
            return rejectWithValue(error.response?.data?.message || 'Signup failed');
        }
    }
);

// ---------------------------------login-------------------------------
export const Login = createAsyncThunk(
    'auth/Login', async (credentials, { rejectWithValue }) => {
        try {
            const { data } = await axiosIstance.post('/auth/login', credentials);
            return data;
        } catch (error) {
            // Use rejectWithValue to pass a specific error payload
            return rejectWithValue(error.response?.data?.message || 'Login failed');
        }
    }
);

// -------------------logout----------------------------
export const logout = createAsyncThunk(
    'auth/logout', async (_, { rejectWithValue }) => {
        try {
            await axiosIstance.post('/auth/logout');
            // remove local storage carts
            localStorage.removeItem('cartItems');
        
            // No specific data is needed on successful logout.
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Logout failed');
        }
    }
)

// Check if user data exists in localStorage on initialization
const userFromStorage = localStorage.getItem('user');
const initialState = {
    user: userFromStorage ? JSON.parse(userFromStorage) : null,
    loading: true,
    AllUsers: [] ,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setUser(state, action) {
            state.user = action.payload;
        },
        setLoading(state, action) {
            state.loading = action.payload;
        },
        setAllUsers(state, action) {
            state.AllUsers = action.payload;
        }
    },

    extraReducers: (builder) => {
        builder
            .addCase(Signup.pending, (state) => {
                state.loading = true;
            })
            .addCase(Signup.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                // Save user data to localStorage
                if (action.payload) {
                    localStorage.setItem('user', JSON.stringify(action.payload));
                }
            })
            .addCase(Signup.rejected, (state) => {
                state.loading = false;
            })
            .addCase(Login.pending, (state) => {
                state.loading = true;
            })
            .addCase(Login.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                // Save user data to localStorage
                if (action.payload) {
                    localStorage.setItem('user', JSON.stringify(action.payload));
                }
            })
            .addCase(Login.rejected, (state) => {
                state.loading = false;
            })
            .addCase(CurrentUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(CurrentUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                // Save user data to localStorage
                if (action.payload) {
                    localStorage.setItem('user', JSON.stringify(action.payload));
                }
            })
            .addCase(CurrentUser.rejected, (state, action) => {
                state.loading = false;
                state.user = null;
                // On failure to get current user, ensure local storage is also cleared.
                localStorage.removeItem('user');
            })
            .addCase(logout.pending, (state) => {
                state.loading = true;
            })
            .addCase(logout.fulfilled, (state) => {
                state.loading = false;
                state.user = null;
                // Remove user data from localStorage on logout
                localStorage.removeItem('user');
            })
            .addCase(logout.rejected, (state) => {
                state.loading = false;
            })
            .addCase(GetAllUsers.pending, (state) => {
                state.loading = true;
            }).addCase(GetAllUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.AllUsers = action.payload;
            }).addCase(GetAllUsers.rejected, (state) => {
                state.loading = false;
            })

    }
});

export default authSlice.reducer;
