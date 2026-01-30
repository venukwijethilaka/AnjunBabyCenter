import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export enum Role {
  ADMIN = "ADMIN",
  CUSTOMER = "CUSTOMER",
}

export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  phoneNumber: string;
  role: Role;
  isActive: boolean;
  createdAt: Date;
  wishlist?: Wishlist[];
  cart?: Cart;
  orders?: Order[];
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

export interface CreateProductInput {
  name: string;
  description: string;
  price: number;
  quantity: number;
  // Replace imageUrl with an array
  images: { url: string; isMain?: boolean; altText?: string }[]; 
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

export interface ApiResponse<T> {
  message: string;
  data: T;
}

export const api = createApi({
    baseQuery: fetchBaseQuery({ 
      baseUrl: "/api",
      prepareHeaders: (headers) => {
        // Add any auth headers here if needed
        return headers;
      }
    }),
    reducerPath: "api",
    tagTypes: ["Products", "Categories"],
    endpoints: (build) => ({
        // GET all categories
        getCategories: build.query<Category[], void>({
            query: () => ({
                url: "/categories",
                method: "GET",
            }),
            transformResponse: (response: ApiResponse<Category[]>) => response.data,
            providesTags: ["Categories"],
            keepUnusedDataFor: 300,
        }),

        // GET all products
        getProducts: build.query<Product[], void>({
            query: () => ({
                url: "/products",
                method: "GET",
            }),
            transformResponse: (response: ApiResponse<Product[]>) => response.data,
            providesTags: ["Products"],
            keepUnusedDataFor: 300,
        }),

        // GET product by ID
        getProductById: build.query<Product, number>({
            query: (id) => ({
                url: `/products/${id}`,
                method: "GET",
            }),
            transformResponse: (response: ApiResponse<Product>) => response.data,
            providesTags: ["Products"],
        }),

        // CREATE product
        createProduct: build.mutation<Product, CreateProductInput>({
            query: (product) => ({
                url: "/products",
                method: "POST",
                body: product,
            }),
            transformResponse: (response: ApiResponse<Product>) => response.data,
            invalidatesTags: ["Products"],
        }),

        // UPDATE product
        updateProduct: build.mutation<Product, { id: number; data: UpdateProductInput }>({
            query: ({ id, data }) => ({
                url: `/products/${id}`,
                method: "PUT",
                body: data,
            }),
            transformResponse: (response: ApiResponse<Product>) => response.data,
            invalidatesTags: ["Products"],
        }),

        // DELETE product
        deleteProduct: build.mutation<Product, number>({
            query: (id) => ({
                url: `/products/${id}`,
                method: "DELETE",
            }),
            transformResponse: (response: ApiResponse<Product>) => response.data,
            invalidatesTags: ["Products"],
        }),
    })
});

export const { 
    useGetCategoriesQuery,
    useGetProductsQuery,
    useGetProductByIdQuery,
    useCreateProductMutation,
    useUpdateProductMutation,
    useDeleteProductMutation
} = api;
