import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setCredentials, logout } from "./authSlice";

// --- ENUMS & INTERFACES ---

export enum Role {
  ADMIN = "ADMIN",
  CUSTOMER = "CUSTOMER",
  SUPER_ADMIN = "SUPER_ADMIN"
}

export interface LoyaltyLevel {
  id: number;
  name: string;
  minPoints: number;
  discount: number;
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
  street?: string | null;
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
  imageUrl?: string;
  children?: Category[];
  products?: Product[];
  createdAt: Date;
}

// ✅ NEW: Promotional Offer Interface
export interface PromotionalOffer {
  id: number;
  title: string;
  description?: string | null;
  offerPrice: number;
  endDate: string; // ISO date string
  isActive: boolean;
  productId: number;
  product?: Product;
  createdAt?: string;
  updatedAt?: string;
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
  discountPercentage?: number | null;
  categoryId: number;
  category?: Category;
  wishlist?: Wishlist[];
  cartItems?: CartItem[];
  orderItems?: OrderItem[];
  promotionalOffers?: PromotionalOffer[];
  createdAt: Date;
  // Algorithm-computed fields (returned by smart endpoints only)
  _orderCount?: number;
  _offerPrice?: number;
  _offerEndDate?: string;
  _offerId?: number;
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

export interface ShippingAddress {
  street: string;
  city: string;
  postalCode: string;
  country: string;
  phone: string;
}

export interface OrderItem {
  id: number;
  orderId: number;
  productId: number;
  quantity: number;
  price: string;
  product: {
    id: number;
    name: string;
    images: { url: string; isMain: boolean }[];
  };
}

export interface Order {
  id: number;
  userId: number;
  totalAmount: number;
  status: 'PENDING' | 'ARRANGING' | 'SHIPPING' | 'DELIVERED' | 'CANCELLED';
  createdAt: string;
  updatedAt: string;
  address: ShippingAddress;
  trackingId?: string;
  items: OrderItem[];
  user?: {
    id: number;
    name: string;
    email: string;
  };
}

export interface CreateOrderRequest {
  userId: number;
  address: ShippingAddress;
  items: {
    productId: number;
    quantity: number;
    price: number;
  }[];
  totalAmount: number;
}

export interface UpdateOrderStatusRequest {
  orderId: number;
  status: string;
  trackingId?: string;
}

export interface Banner {
  id: number;
  title?: string;
  imageUrl: string;
  mobileImageUrl?: string;
  bannerPosition: 'HERO' | 'SECONDARY' | 'PROMOTIONAL' | 'FOOTER';
  isSlider: boolean;
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
  link?: string;
}

export interface CreateBannerRequest {
  title?: string;
  imageUrl: string;
  mobileImageUrl?: string;
  bannerPosition: string;
  isSlider: boolean;
  displayOrder: number;
  isActive: boolean;
  link?: string;
}

export interface UpdateBannerRequest {
  id: number;
  title?: string;
  imageUrl?: string;
  mobileImageUrl?: string;
  bannerPosition?: string;
  isSlider?: boolean;
  displayOrder?: number;
  isActive?: boolean;
  link?: string;
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
  discountPercentage?: number | null;
}

export interface UpdateProductInput extends Partial<CreateProductInput> { }

export interface CreateCategoryInput {
  name: string;
  parentId?: number | null;
  imageUrl?: string;
}

export interface UpdateCategoryInput extends Partial<CreateCategoryInput> { }


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

export interface OtpResponse {
  message: string;
  hash: string;
  expiry: number;
}

export interface VerifyOtpRequest {
  email: string;
  otp: string;
  hash: string;
  expiry: number;
}

export interface ResetPasswordRequest {
  email: string;
  otp: string;
  hash: string;
  expiry: number;
  newPassword: string;
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

  return result;
};

export const api = createApi({
  baseQuery: baseQueryWithReauth,
  reducerPath: "api",
  // ✅ ADDED "Offers" to tagTypes
  tagTypes: ["Products", "User", "Loyalty", "Categories", "Cart", "Order", "UserOrders", "Banner", "ActiveBanners", "Offers"],
  endpoints: (build) => ({

    // --- AUTH ENDPOINTS ---
    register: build.mutation<OtpResponse, RegisterRequest>({
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
    resendOtp: build.mutation<OtpResponse, { email: string }>({
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
      transformResponse: (response: any) => response.data || response,
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

    // --- LOYALTY MANAGEMENT ENDPOINTS ---
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
      keepUnusedDataFor: 300,
    }),
    // Algorithm-driven section endpoints
    getTrendingProducts: build.query<Product[], void>({
      query: () => ({ url: "/products/trending", method: "GET" }),
      transformResponse: (response: ApiResponse<Product[]>) => response.data,
      providesTags: ["Products"],
      keepUnusedDataFor: 300,
    }),
    getFeaturedProducts: build.query<Product[], void>({
      query: () => ({ url: "/products/featured", method: "GET" }),
      transformResponse: (response: ApiResponse<Product[]>) => response.data,
      providesTags: ["Products"],
      keepUnusedDataFor: 300,
    }),
    getFlashSaleProducts: build.query<Product[], void>({
      query: () => ({ url: "/products/flash-sale", method: "GET" }),
      transformResponse: (response: ApiResponse<Product[]>) => response.data,
      providesTags: ["Products"],
      keepUnusedDataFor: 300,
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
    // ✅ Fast availability-only toggle
    toggleProductAvailability: build.mutation<Product, { id: number; availability: boolean }>({
      query: ({ id, availability }) => ({
        url: `/products/${id}/availability`,
        method: "PATCH",
        body: { availability },
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
    createCategory: build.mutation<Category, CreateCategoryInput>({
      query: (category) => ({
        url: "/categories",
        method: "POST",
        body: category,
      }),
      transformResponse: (response: ApiResponse<Category>) => response.data,
      invalidatesTags: ["Categories"],
    }),
    updateCategory: build.mutation<Category, { id: number, data: UpdateCategoryInput }>({
      query: ({ id, data }) => ({
        url: `/categories/${id}`,
        method: "PUT",
        body: data,
      }),
      transformResponse: (response: ApiResponse<Category>) => response.data,
      invalidatesTags: ["Categories"],
    }),
    deleteCategory: build.mutation<void, number>({
      query: (id) => ({
        url: `/categories/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Categories"],
    }),

    // --- PASSWORD RECOVERY ---
    forgotPassword: build.mutation<OtpResponse, { email: string }>({
      query: (data) => ({
        url: "/users/auth/forgot-password",
        method: "POST",
        body: data,
      }),
    }),
    resetPassword: build.mutation<{ message: string }, ResetPasswordRequest>({
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

    // --- CART ---
    addToCart: build.mutation<CartItem, { userId: number; productId: number; quantity: number }>({
      query: (data) => ({
        url: "/cart",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ['Cart'],
    }),
    deleteCartItem: build.mutation<{ success: boolean }, { cartItemId: number }>({
      query: (data) => ({
        url: `/cart/${data.cartItemId}`,
        method: "DELETE",
      }),
      invalidatesTags: ['Cart'],
    }),
    getCart: build.query<Cart, number>({
      query: (userId) => ({
        url: `/cart/${userId}`,
        method: "GET",
      }),
      providesTags: ['Cart'],
    }),

    // --- ORDER MANAGEMENT ---
    createOrder: build.mutation<Order, CreateOrderRequest>({
      query: (orderData) => ({
        url: '/orders',
        method: 'POST',
        body: orderData,
      }),
      invalidatesTags: ['UserOrders'],
    }),
    getUserOrders: build.query<Order[], number>({
      query: (userId) => `/orders/user/${userId}`,
      providesTags: ['UserOrders'],
    }),
    getOrderById: build.query<Order, number>({
      query: (orderId) => `/orders/${orderId}`,
      providesTags: (_result, _error, orderId) => [{ type: 'Order', id: orderId }],
    }),
    getAllOrders: build.query<Order[], void>({
      query: () => '/orders',
      transformResponse: (response: any) => response.data || response,
      providesTags: ['Order'],
    }),
    updateOrderStatus: build.mutation<Order, UpdateOrderStatusRequest>({
      query: ({ orderId, ...body }) => ({
        url: `/orders/${orderId}/status`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: (_result, _error, { orderId }) => [
        { type: 'Order', id: orderId },
        'UserOrders',
        'Order',
        'User',
      ],
    }),
    cancelOrder: build.mutation<Order, number>({
      query: (orderId) => ({
        url: `/orders/${orderId}/cancel`,
        method: 'POST',
      }),
      invalidatesTags: (_result, _error, orderId) => [
        { type: 'Order', id: orderId },
        'UserOrders',
      ],
    }),
    updateTrackingId: build.mutation<Order, { orderId: number; trackingId: string }>({
      query: ({ orderId, trackingId }) => ({
        url: `/orders/${orderId}/tracking`,
        method: 'PATCH',
        body: { trackingId },
      }),
      invalidatesTags: (_result, _error, { orderId }) => [
        { type: 'Order', id: orderId },
        'UserOrders',
      ],
    }),

    // --- HOMEPAGE & BANNERS ---
    getAllBanners: build.query<Banner[], void>({
      query: () => '/banners',
      providesTags: ['Banner'],
      keepUnusedDataFor: 300,
    }),
    getActiveBanners: build.query<Banner[], string | void>({
      query: (position) => position ? `/banners/active?position=${position}` : '/banners/active',
      providesTags: ['ActiveBanners'],
      keepUnusedDataFor: 300,
    }),
    getBannerById: build.query<Banner, number>({
      query: (id) => `/banners/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Banner', id }],
    }),
    createBanner: build.mutation<Banner, CreateBannerRequest>({
      query: (bannerData) => ({
        url: '/banners',
        method: 'POST',
        body: bannerData,
      }),
      invalidatesTags: ['Banner', 'ActiveBanners'],
    }),
    updateBanner: build.mutation<Banner, UpdateBannerRequest>({
      query: ({ id, ...data }) => ({
        url: `/banners/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['Banner', 'ActiveBanners'],
    }),
    deleteBanner: build.mutation<void, number>({
      query: (id) => ({
        url: `/banners/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Banner', 'ActiveBanners'],
    }),
    toggleBannerStatus: build.mutation<Banner, number>({
      query: (id) => ({
        url: `/banners/${id}/toggle`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Banner', 'ActiveBanners'],
    }),
    getImageKitAuth: build.query<{ token: string; expire: number; signature: string; }, void>({
      query: () => '/banners/imagekit/auth',
    }),

    // ✅ NEW: PROMOTIONAL OFFERS ENDPOINTS
    getActiveOffer: build.query<PromotionalOffer, void>({
      query: () => '/offers/active',
      providesTags: ['Offers'],
    }),
    // Client homepage — active + non-expired only
    getAllOffers: build.query<PromotionalOffer[], void>({
      query: () => '/offers',
      providesTags: ['Offers'],
      keepUnusedDataFor: 300,
    }),
    // Admin panel — all offers including expired/inactive
    getAllOffersAdmin: build.query<PromotionalOffer[], void>({
      query: () => '/offers?all=true',
      providesTags: ['Offers'],
    }),
    createOffer: build.mutation<PromotionalOffer, Partial<PromotionalOffer>>({
      query: (data) => ({
        url: '/offers',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Offers'],
    }),
    updateOffer: build.mutation<PromotionalOffer, { id: number; data: Partial<PromotionalOffer> }>({
      query: ({ id, data }) => ({
        url: `/offers/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Offers'],
    }),
    deleteOffer: build.mutation<void, number>({
      query: (id) => ({
        url: `/offers/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Offers'],
    }),
  })
});

export const {
  useGetProductsQuery,
  useGetTrendingProductsQuery,
  useGetFeaturedProductsQuery,
  useGetFlashSaleProductsQuery,
  useGetProductByIdQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useToggleProductAvailabilityMutation,
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
  useGetLoyaltyLevelsQuery,
  useCreateLoyaltyLevelMutation,
  useUpdateLoyaltyLevelMutation,
  useDeleteLoyaltyLevelMutation,
  useGetCategoriesQuery,
  useAddToCartMutation,
  useDeleteCartItemMutation,
  useGetCartQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useCreateOrderMutation,
  useGetUserOrdersQuery,
  useGetOrderByIdQuery,
  useGetAllOrdersQuery,
  useUpdateOrderStatusMutation,
  useCancelOrderMutation,
  useUpdateTrackingIdMutation,
  useGetAllBannersQuery,
  useGetActiveBannersQuery,
  useGetBannerByIdQuery,
  useCreateBannerMutation,
  useUpdateBannerMutation,
  useDeleteBannerMutation,
  useToggleBannerStatusMutation,
  useGetImageKitAuthQuery,
  // ✅ NEW: Promotional Offer Hooks Exported
  useGetActiveOfferQuery,
  useGetAllOffersQuery,
  useGetAllOffersAdminQuery,
  useCreateOfferMutation,
  useUpdateOfferMutation,
  useDeleteOfferMutation,
} = api;