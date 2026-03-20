import type { Request, Response } from "express";
export declare const handleUpdateTrackingId: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const handleUpdateOrderStatus: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const handleCreateOrder: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const handleGetUserOrders: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const handleGetOrderById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const handleCancelOrder: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const handleGetAllOrders: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=order.controller.d.ts.map