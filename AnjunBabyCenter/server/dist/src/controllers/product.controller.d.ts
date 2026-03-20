import type { Request, Response } from "express";
export declare const createProduct: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getProducts: (_req: Request, res: Response) => Promise<void>;
export declare const getTrendingProducts: (req: Request, res: Response) => Promise<void>;
export declare const getFeaturedProducts: (req: Request, res: Response) => Promise<void>;
export declare const getFlashSaleProducts: (req: Request, res: Response) => Promise<void>;
export declare const getProductById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const updateProduct: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const toggleAvailability: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const deleteProduct: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=product.controller.d.ts.map