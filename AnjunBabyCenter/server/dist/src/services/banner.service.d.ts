export declare const getAllBanners: () => Promise<{
    id: number;
    isActive: boolean;
    createdAt: Date;
    link: string | null;
    imageUrl: string;
    title: string | null;
    mobileImageUrl: string | null;
    bannerPosition: string;
    isSlider: boolean;
    displayOrder: number;
}[]>;
export declare const getActiveBanners: (position?: string) => Promise<{
    id: number;
    isActive: boolean;
    createdAt: Date;
    link: string | null;
    imageUrl: string;
    title: string | null;
    mobileImageUrl: string | null;
    bannerPosition: string;
    isSlider: boolean;
    displayOrder: number;
}[]>;
export declare const getBannerById: (id: number) => Promise<{
    id: number;
    isActive: boolean;
    createdAt: Date;
    link: string | null;
    imageUrl: string;
    title: string | null;
    mobileImageUrl: string | null;
    bannerPosition: string;
    isSlider: boolean;
    displayOrder: number;
} | null>;
export declare const createBanner: (data: any) => Promise<{
    id: number;
    isActive: boolean;
    createdAt: Date;
    link: string | null;
    imageUrl: string;
    title: string | null;
    mobileImageUrl: string | null;
    bannerPosition: string;
    isSlider: boolean;
    displayOrder: number;
}>;
export declare const updateBanner: (id: number, data: any) => Promise<{
    id: number;
    isActive: boolean;
    createdAt: Date;
    link: string | null;
    imageUrl: string;
    title: string | null;
    mobileImageUrl: string | null;
    bannerPosition: string;
    isSlider: boolean;
    displayOrder: number;
}>;
export declare const deleteBanner: (id: number) => Promise<{
    id: number;
    isActive: boolean;
    createdAt: Date;
    link: string | null;
    imageUrl: string;
    title: string | null;
    mobileImageUrl: string | null;
    bannerPosition: string;
    isSlider: boolean;
    displayOrder: number;
}>;
//# sourceMappingURL=banner.service.d.ts.map