import ImageKit from "imagekit";
import type { Request, Response } from "express";

// Initialize with a helper function to ensure vars exist
const getImageKitInstance = () => {
  const publicKey = process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY;
  const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
  const urlEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL;

  if (!publicKey || !privateKey || !urlEndpoint) {
    throw new Error("ImageKit environment variables are missing! Check your .env file.");
  }

  return new ImageKit({
    publicKey,
    privateKey,
    urlEndpoint,
  });
};

export const getAuthParams = async (req: Request, res: Response) => {
  try {
    const imagekit = getImageKitInstance();
    const result = imagekit.getAuthenticationParameters();
    res.json(result);
  } catch (error: any) {
    console.error("ImageKit Auth Error:", error.message);
    res.status(500).json({ error: error.message });
  }
};