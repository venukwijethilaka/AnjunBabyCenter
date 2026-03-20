import type { Request, Response } from "express";
export declare const addItemToWishlist: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getUserWishlist: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const deleteWishlistItem: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const deleteWishlistItemByProductAndUser: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const checkWishlistStatus: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=wishlist.controller.d.ts.map