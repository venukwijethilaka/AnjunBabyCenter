import type { Request, Response } from 'express';
export declare const getBanners: (req: Request, res: Response) => Promise<void>;
export declare const getActiveBanners: (req: Request, res: Response) => Promise<void>;
export declare const getBannerById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const createBanner: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const updateBanner: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const deleteBanner: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=banner.controller.d.ts.map