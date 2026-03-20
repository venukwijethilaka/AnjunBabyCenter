import * as runtime from "@prisma/client/runtime/client";
import * as $Class from "./internal/class";
import * as Prisma from "./internal/prismaNamespace";
export * as $Enums from './enums';
export * from "./enums";
/**
 * ## Prisma Client
 *
 * Type-safe database client for TypeScript
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more LoyaltyLevels
 * const loyaltyLevels = await prisma.loyaltyLevel.findMany()
 * ```
 *
 * Read more in our [docs](https://pris.ly/d/client).
 */
export declare const PrismaClient: $Class.PrismaClientConstructor;
export type PrismaClient<LogOpts extends Prisma.LogLevel = never, OmitOpts extends Prisma.PrismaClientOptions["omit"] = Prisma.PrismaClientOptions["omit"], ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = $Class.PrismaClient<LogOpts, OmitOpts, ExtArgs>;
export { Prisma };
/**
 * Model LoyaltyLevel
 *
 */
export type LoyaltyLevel = Prisma.LoyaltyLevelModel;
/**
 * Model User
 *
 */
export type User = Prisma.UserModel;
/**
 * Model Category
 *
 */
export type Category = Prisma.CategoryModel;
/**
 * Model Product
 *
 */
export type Product = Prisma.ProductModel;
/**
 * Model PromotionalOffer
 *
 */
export type PromotionalOffer = Prisma.PromotionalOfferModel;
/**
 * Model ProductImage
 *
 */
export type ProductImage = Prisma.ProductImageModel;
/**
 * Model Wishlist
 *
 */
export type Wishlist = Prisma.WishlistModel;
/**
 * Model Cart
 *
 */
export type Cart = Prisma.CartModel;
/**
 * Model CartItem
 *
 */
export type CartItem = Prisma.CartItemModel;
/**
 * Model Order
 *
 */
export type Order = Prisma.OrderModel;
/**
 * Model OrderItem
 *
 */
export type OrderItem = Prisma.OrderItemModel;
/**
 * Model Banner
 *
 */
export type Banner = Prisma.BannerModel;
//# sourceMappingURL=client.d.ts.map