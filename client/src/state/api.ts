import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setCredentials, logout } from "./authSlice"; 

// --- ENUMS & INTERFACES ---

export enum Role {
  ADMIN = "ADMIN",
  CUSTOMER = "CUSTOMER",
  SUPER_ADMIN = "SUPER_ADMIN"
}

// ✅ UPDATED: Loyalty Level Interface with Discount
export interface LoyaltyLevel {
  id: number;
  name: string;
  minPoints: number;
  discount: number; // ✅ Added Discount Field
  color: string;
  badgeColor: string;
  updatedAt: Date;
}
export interface User {
  id: number;
  email: string;
  name?: string | null;
  password?: string | null;
  googleId?: string | null;

  phone?: string | null;
  bio?: string | null;
  country?: string | null;
  city?: string | null;
  postalCode?: string | null;
  taxId?: string | null;
  avatar?: string | null;

  role: Role;
  loyaltyPoints: number;
  otp?: string | null;
  otpExpires?: string | null;
  isActive: boolean;
  refreshToken?: string | null;

  wishlist?: Wishlist[];
  cart?: Cart | null;
  orders?: Order[];

  createdAt: string;
  updatedAt: string;

  banReason?: string | null;
  banExpiresAt?: string | null;
}

export interface Category {
  id: number;
  name: string;
  isActive: boolean;
  parentId?: number | null;
  parent?: Category | null;
  children?: Category[];
  products?: Product[];
  createdAt: Date;
}


export interface Product {
  id: number;
  name: string;
  description: string;
  color?: string | null;
  size?: string | null;
  price: number;
  quantity: number;
  availability: boolean;
  images: { url: string; isMain: boolean }[];
  isFeatured: boolean;
  isTrending: boolean;
  isFlashSale: boolean;
  discountPercentage?: number | null;
  categoryId: number;
  category?: Category;
  wishlist?: Wishlist[];
  cartItems?: CartItem[];
  orderItems?: OrderItem[];
  createdAt: Date;
}
export interface ProductImage {
  id: number;
  url: string;
  altText?: string | null;
  isMain: boolean;
  productId: number;
}

export interface Wishlist {
  id: number;
  userId: number;
  productId: number;
  user?: User;
  product?: Product;
  createdAt: Date;
}

export interface Cart {
  id: number;
  userId: number;
  user?: User;
  items?: CartItem[];
  createdAt: Date;
}

export interface CartItem {
  id: number;
  cartId: number;
  productId: number;
  quantity: number;
  cart?: Cart;
  product?: Product;
}

export interface Order {
  id: number;
  userId: number;
  totalAmount: number;
  status: string;
  user?: User;
  items?: OrderItem[];
  createdAt: Date;
}

export interface OrderItem {
  id: number;
  orderId: number;
  productId: number;
  quantity: number;
  price: number;
  order?: Order;
  product?: Product;
}

export interface Banner {
  id: number;
  title?: string | null;
  imageUrl: string;
  bannerPosition: string;
  isSlider: boolean;
  displayOrder: number;
  isActive: boolean;
  createdAt: Date;
}

// --- INPUT INTERFACES ---

export interface CreateProductInput {
  name: string;
  description: string;
  price: number;
  quantity: number;
  imageUrl: string;
  categoryId: number;
  color?: string | null;
  size?: string | null;
  availability?: boolean;
  isFeatured?: boolean;
  isTrending?: boolean;
  isFlashSale?: boolean;
  discountPercentage?: number | null;
}

export interface UpdateProductInput extends Partial<CreateProductInput> {}

// --- AUTH INTERFACES ---

export interface RegisterRequest {
  name: string;
  email: string;
  password?: string;
}

export interface LoginRequest {
  email: string;
  password?: string;
  rememberMe?: boolean; 
}

export interface VerifyOtpRequest {
  email: string;
  otp: string;
}

export interface GoogleLoginRequest {
  email: string;
  googleId: string;
  name: string;
}

export interface AuthResponse {
  message: string;
}

export interface TokenResponse {
  accessToken: string;
  refreshToken: string; 
  user: User;
}

export interface RefreshResponse {
    accessToken: string;
}

export interface ApiResponse<T> {
  message: string;
  data: T;
}


// --- API DEFINITION WITH REFRESH TOKEN LOGIC ---

const baseQuery = fetchBaseQuery({ 
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000",
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as any).auth?.token;
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    }
});

const baseQueryWithReauth = async (args: any, api: any, extraOptions: any) => {
    let result = await baseQuery(args, api, extraOptions);

    // ONLY attempt refresh on 401 (Expired). 
    // Do NOT trigger refresh logic on 403 (Permission Denied).
    if (result.error && result.error.status === 401) {
        const state = api.getState();
        const refreshToken = (state as any).auth?.refreshToken;

        if (refreshToken) {
            const refreshResult = await baseQuery(
                { url: "/users/auth/refresh", method: "POST", body: { refreshToken } },
                api,
                extraOptions
            );

            if (refreshResult.data) {
                const newAccessToken = (refreshResult.data as RefreshResponse).accessToken;
                api.dispatch(setCredentials({ 
                    token: newAccessToken,
                    user: (state as any).auth.user,
                    refreshToken: refreshToken, 
                    isRestoring: true 
                }));
                result = await baseQuery(args, api, extraOptions);
            } else {
                api.dispatch(logout());
            }
        } else {
            api.dispatch(logout());
        }
    }
    
    // Handle 403 separately: Just return the error so the UI can show "Permission Denied"
    return result;
};

export const api = createApi({
  baseQuery: baseQueryWithReauth, 
  reducerPath: "api",
  tagTypes: ["Products", "User", "Loyalty","Categories"], // ✅ Added Loyalty Tag
  endpoints: (build) => ({
      
      // --- AUTH ENDPOINTS ---
      register: build.mutation<AuthResponse, RegisterRequest>({
          query: (userData) => ({
              url: "/users/auth/register",
              method: "POST",
              body: userData,
          }),
      }),
      login: build.mutation<TokenResponse, LoginRequest>({
          query: (credentials) => ({
              url: "/users/auth/login", 
              method: "POST",
              body: credentials,
          }),
      }),
      verifyOtp: build.mutation<TokenResponse, VerifyOtpRequest>({
          query: (data) => ({
              url: "/users/auth/verify",
              method: "POST",
              body: data,
          }),
      }),
      resendOtp: build.mutation<{ message: string }, { email: string }>({
          query: (data) => ({
              url: "/users/auth/resend-otp",
              method: "POST",
              body: data,
          }),
      }),
      googleLogin: build.mutation<TokenResponse, GoogleLoginRequest>({
          query: (data) => ({
              url: "/users/auth/google",
              method: "POST",
              body: data,
          }),
      }),
      getProfile: build.query<User, string>({
        query: (id) => `users/profile/${id}`,
        providesTags: ["User"],
      }),
      updateProfile: build.mutation<User, { id: string; data: any }>({
        query: ({ id, data }) => ({
          url: `users/profile/${id}`,
          method: "PUT",
          body: data,
        }),
        invalidatesTags: ["User"],
      }),

      // --- USER MANAGEMENT ENDPOINTS ---
      getUsers: build.query<User[], void>({
        query: () => "/users", 
        providesTags: ["User"],
      }),
      
      toggleUserStatus: build.mutation<User, { userId: number; isActive: boolean; banReason?: string; banDuration?: number }>({
        query: ({ userId, isActive, banReason, banDuration }) => ({
          url: `/users/${userId}/status`, 
          method: "PATCH",
          body: { isActive, banReason, banDuration },
        }),
        invalidatesTags: ["User"],
      }),
      
      updateUserRole: build.mutation<User, { userId: number; role: Role }>({
        query: ({ userId, role }) => ({
          url: `/users/${userId}/role`, 
          method: "PATCH",
          body: { role },
        }),
        invalidatesTags: ["User"],
      }),

      // ✅ --- LOYALTY MANAGEMENT ENDPOINTS (FULL CRUD) ---
      getLoyaltyLevels: build.query<LoyaltyLevel[], void>({
        query: () => "/users/loyalty-levels",
        providesTags: ["Loyalty"],
      }),
      
      createLoyaltyLevel: build.mutation<LoyaltyLevel, Partial<LoyaltyLevel>>({
        query: (data) => ({
            url: "/users/loyalty-levels",
            method: "POST",
            body: data,
        }),
        invalidatesTags: ["Loyalty"],
      }),

      updateLoyaltyLevel: build.mutation<LoyaltyLevel, Partial<LoyaltyLevel>>({
        query: ({ id, ...patch }) => ({
            url: `/users/loyalty-levels/${id}`,
            method: "PATCH",
            body: patch,
        }),
        invalidatesTags: ["Loyalty"],
      }),

      deleteLoyaltyLevel: build.mutation<void, number>({
        query: (id) => ({
            url: `/users/loyalty-levels/${id}`,
            method: "DELETE",
        }),
        invalidatesTags: ["Loyalty"],
      }),

      // --- PRODUCT ENDPOINTS ---
      getProducts: build.query<Product[], void>({
          query: () => ({
              url: "/products",
              method: "GET",
          }),
          transformResponse: (response: ApiResponse<Product[]>) => response.data,
          providesTags: ["Products"],
      }),
      getProductById: build.query<Product, number>({
          query: (id) => ({
              url: `/products/${id}`,
              method: "GET",
          }),
          transformResponse: (response: ApiResponse<Product>) => response.data,
          providesTags: ["Products"],
      }),
      createProduct: build.mutation<Product, CreateProductInput>({
          query: (product) => ({
              url: "/products",
              method: "POST",
              body: product,
          }),
          transformResponse: (response: ApiResponse<Product>) => response.data,
          invalidatesTags: ["Products"],
      }),
      updateProduct: build.mutation<Product, { id: number; data: UpdateProductInput }>({
          query: ({ id, data }) => ({
              url: `/products/${id}`,
              method: "PUT",
              body: data,
          }),
          transformResponse: (response: ApiResponse<Product>) => response.data,
          invalidatesTags: ["Products"],
      }),
      deleteProduct: build.mutation<Product, number>({
          query: (id) => ({
              url: `/products/${id}`,
              method: "DELETE",
          }),
          transformResponse: (response: ApiResponse<Product>) => response.data,
          invalidatesTags: ["Products"],
      }),

      // --- CATEGORIES ENDPOINTS ---
      getCategories: build.query<Category[], void>({
            query: () => ({
                url: "/categories",
                method: "GET",
            }),
            transformResponse: (response: ApiResponse<Category[]>) => response.data,
            providesTags: ["Categories"],
            keepUnusedDataFor: 300,
        }),
      
      // --- PASSWORD RECOVERY ---
      forgotPassword: build.mutation<{ message: string }, { email: string }>({
          query: (data) => ({
              url: "/users/auth/forgot-password",
              method: "POST",
              body: data,
          }),
      }),
      resetPassword: build.mutation<{ message: string }, { email: string, otp: string, newPassword: string }>({
          query: (data) => ({
              url: "/users/auth/reset-password",
              method: "POST",
              body: data,
          }),
      }),
      changePassword: build.mutation<{ message: string }, { userId: number, currentPassword: string, newPassword: string }>({
          query: (data) => ({
              url: "/users/auth/change-password",
              method: "POST",
              body: data,
          }),
      }),
  })
});

export const { 
  useGetProductsQuery,
  useGetProductByIdQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useRegisterMutation,
  useLoginMutation,
  useVerifyOtpMutation,
  useResendOtpMutation,
  useGoogleLoginMutation,
  useGetProfileQuery,
  useUpdateProfileMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useChangePasswordMutation,
  useGetUsersQuery,
  useToggleUserStatusMutation,
  useUpdateUserRoleMutation,
  // ✅ New Exports for Loyalty
  useGetLoyaltyLevelsQuery,
  useCreateLoyaltyLevelMutation,
  useUpdateLoyaltyLevelMutation,
  useDeleteLoyaltyLevelMutation,
  useGetCategoriesQuery
} = api;