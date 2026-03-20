/**
 * Creates a cryptographic hash of the OTP data.
 */
export declare const generateOtpHash: (email: string, otp: string, expiry: number) => string;
/**
 * Verifies the hash using a timing-safe comparison to prevent side-channel attacks.
 */
export declare const verifyOtpHash: (email: string, otp: string, expiry: number, hash: string) => boolean;
export declare const sendEmail: (to: string, subject: string, text: string) => Promise<void>;
export declare const generateTokens: (userId: number, refreshExpiry?: string) => Promise<{
    accessToken: string;
    refreshToken: string;
}>;
export declare const findOrCreateGoogleUser: (email: string, googleId: string, name: string) => Promise<{
    accessToken: string;
    refreshToken: string;
    user: {
        name: string | null;
        id: number;
        email: string;
        googleId: string | null;
        password: string | null;
        role: import("../../generated/prisma/enums").Role;
        avatar: string | null;
        phone: string | null;
        city: string | null;
        country: string | null;
        postalCode: string | null;
        loyaltyPoints: number;
        isActive: boolean;
        refreshToken: string | null;
        banExpiresAt: Date | null;
        banReason: string | null;
        createdAt: Date;
        updatedAt: Date;
    };
}>;
export declare const registerUser: (name: string, email: string, password: string) => Promise<{
    hash: string;
    expiry: number;
}>;
export declare const resendOtp: (email: string) => Promise<{
    hash: string;
    expiry: number;
}>;
export declare const loginUser: (email: string, password: string, rememberMe?: boolean) => Promise<{
    accessToken: string;
    refreshToken: string;
    user: {
        name: string | null;
        id: number;
        email: string;
        googleId: string | null;
        password: string | null;
        role: import("../../generated/prisma/enums").Role;
        avatar: string | null;
        phone: string | null;
        city: string | null;
        country: string | null;
        postalCode: string | null;
        loyaltyPoints: number;
        isActive: boolean;
        refreshToken: string | null;
        banExpiresAt: Date | null;
        banReason: string | null;
        createdAt: Date;
        updatedAt: Date;
    };
}>;
export declare const verifyOtp: (email: string, otp: string, hash: string, expiry: number) => Promise<{
    accessToken: string;
    refreshToken: string;
    user: {
        name: string | null;
        id: number;
        email: string;
        googleId: string | null;
        password: string | null;
        role: import("../../generated/prisma/enums").Role;
        avatar: string | null;
        phone: string | null;
        city: string | null;
        country: string | null;
        postalCode: string | null;
        loyaltyPoints: number;
        isActive: boolean;
        refreshToken: string | null;
        banExpiresAt: Date | null;
        banReason: string | null;
        createdAt: Date;
        updatedAt: Date;
    };
}>;
export declare const refreshAccessToken: (token: string) => Promise<{
    accessToken: string;
}>;
export declare const getUserProfile: (userId: number) => Promise<{
    name: string | null;
    id: number;
    email: string;
    googleId: string | null;
    password: string | null;
    role: import("../../generated/prisma/enums").Role;
    avatar: string | null;
    phone: string | null;
    city: string | null;
    country: string | null;
    postalCode: string | null;
    loyaltyPoints: number;
    isActive: boolean;
    refreshToken: string | null;
    banExpiresAt: Date | null;
    banReason: string | null;
    createdAt: Date;
    updatedAt: Date;
} | null>;
export declare const updateUserProfile: (userId: number, data: any) => Promise<{
    name: string | null;
    id: number;
    email: string;
    googleId: string | null;
    password: string | null;
    role: import("../../generated/prisma/enums").Role;
    avatar: string | null;
    phone: string | null;
    city: string | null;
    country: string | null;
    postalCode: string | null;
    loyaltyPoints: number;
    isActive: boolean;
    refreshToken: string | null;
    banExpiresAt: Date | null;
    banReason: string | null;
    createdAt: Date;
    updatedAt: Date;
}>;
export declare const forgotPassword: (email: string) => Promise<{
    hash: string;
    expiry: number;
}>;
export declare const resetPassword: (email: string, otp: string, hash: string, expiry: number, newPassword: string) => Promise<boolean>;
export declare const changePassword: (userId: number, currentPassword: string, newPassword: string) => Promise<boolean>;
export declare const getAllUsers: (page?: number, limit?: number) => Promise<{
    data: ({
        orders: ({
            items: {
                id: number;
                price: import("@prisma/client-runtime-utils").Decimal;
                quantity: number;
                orderId: number;
                productId: number;
            }[];
        } & {
            id: number;
            createdAt: Date;
            userId: number;
            totalAmount: import("@prisma/client-runtime-utils").Decimal;
            status: string;
            address: import("@prisma/client/runtime/client").JsonValue;
            trackingId: string | null;
        })[];
    } & {
        name: string | null;
        id: number;
        email: string;
        googleId: string | null;
        password: string | null;
        role: import("../../generated/prisma/enums").Role;
        avatar: string | null;
        phone: string | null;
        city: string | null;
        country: string | null;
        postalCode: string | null;
        loyaltyPoints: number;
        isActive: boolean;
        refreshToken: string | null;
        banExpiresAt: Date | null;
        banReason: string | null;
        createdAt: Date;
        updatedAt: Date;
    })[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}>;
export declare const updateUserStatus: (userId: number, isActive: boolean, banReason?: string, banDurationDays?: number) => Promise<{
    name: string | null;
    id: number;
    email: string;
    googleId: string | null;
    password: string | null;
    role: import("../../generated/prisma/enums").Role;
    avatar: string | null;
    phone: string | null;
    city: string | null;
    country: string | null;
    postalCode: string | null;
    loyaltyPoints: number;
    isActive: boolean;
    refreshToken: string | null;
    banExpiresAt: Date | null;
    banReason: string | null;
    createdAt: Date;
    updatedAt: Date;
}>;
export declare const updateUserRole: (userId: number, role: "ADMIN" | "CUSTOMER" | "SUPER_ADMIN") => Promise<{
    name: string | null;
    id: number;
    email: string;
    googleId: string | null;
    password: string | null;
    role: import("../../generated/prisma/enums").Role;
    avatar: string | null;
    phone: string | null;
    city: string | null;
    country: string | null;
    postalCode: string | null;
    loyaltyPoints: number;
    isActive: boolean;
    refreshToken: string | null;
    banExpiresAt: Date | null;
    banReason: string | null;
    createdAt: Date;
    updatedAt: Date;
}>;
export declare const getAllLoyaltyLevels: () => Promise<{
    name: string;
    id: number;
    updatedAt: Date;
    minPoints: number;
    color: string;
    badgeColor: string;
    discount: number;
}[]>;
export declare const createLoyaltyLevel: (data: any) => Promise<{
    name: string;
    id: number;
    updatedAt: Date;
    minPoints: number;
    color: string;
    badgeColor: string;
    discount: number;
}>;
export declare const updateLoyaltyLevel: (id: number, data: any) => Promise<{
    name: string;
    id: number;
    updatedAt: Date;
    minPoints: number;
    color: string;
    badgeColor: string;
    discount: number;
}>;
export declare const deleteLoyaltyLevel: (id: number) => Promise<{
    name: string;
    id: number;
    updatedAt: Date;
    minPoints: number;
    color: string;
    badgeColor: string;
    discount: number;
}>;
//# sourceMappingURL=user.service.d.ts.map