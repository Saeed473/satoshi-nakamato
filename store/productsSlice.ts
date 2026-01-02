import { apiRequest } from "@/utils/api";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
 
export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiRequest("/api/admin/products");

      if (response.success && response.data) {
        return response.data.map((product: any) => ({
          ...product,
          originalPrice: product.original_price || product.originalPrice,
          additionalInfo: product.additional_info || product.additionalInfo,
          image: product.images?.[0] || product.image,
          image2: product.images?.[1] || product.image2,
        }));
      } else {
        return rejectWithValue("Failed to load products");
      }
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const productsSlice = createSlice({
  name: "products",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as any;
      });
  },
});

export default productsSlice.reducer;
