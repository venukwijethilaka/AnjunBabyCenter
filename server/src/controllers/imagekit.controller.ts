import ImageKit from "imagekit";
import type { Request, Response } from "express";

// Initialize ImageKit
const imagekit = new ImageKit({
  publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
  urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL!,
});

export const getAuthParams = async (req: Request, res: Response) => {
  try {
    // This generates the token, expire, and signature required by the frontend
    const result = imagekit.getAuthenticationParameters();
    res.json(result);
  } catch (error) {
    console.error("ImageKit Auth Error:", error);
    res.status(500).json({ message: "Failed to authenticate with ImageKit" });
  }
};