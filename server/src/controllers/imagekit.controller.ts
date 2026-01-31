import ImageKit from "imagekit";
import type { Request, Response } from "express";

// Initialize with a helper function to ensure vars exist
const getImageKitInstance = () => {
  const publicKey = process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY;
  const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
  const urlEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL;

  const missingKeys = [];
  if (!publicKey) missingKeys.push("NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY");
  if (!privateKey) missingKeys.push("IMAGEKIT_PRIVATE_KEY");
  if (!urlEndpoint) missingKeys.push("NEXT_PUBLIC_IMAGEKIT_URL");

  if (missingKeys.length > 0) {
    throw new Error(`ImageKit environment variables are missing on the server: ${missingKeys.join(", ")}. Check your server's .env file and Docker configuration.`);
  }

  return new ImageKit({
    publicKey: publicKey!,
    privateKey: privateKey!,
    urlEndpoint: urlEndpoint!,
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