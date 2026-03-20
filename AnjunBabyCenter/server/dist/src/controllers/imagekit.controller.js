"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAuthParams = void 0;
const imagekit_1 = __importDefault(require("imagekit"));
// Initialize with a helper function to ensure vars exist
const getImageKitInstance = () => {
    const publicKey = process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY;
    const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
    const urlEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL;
    const missingKeys = [];
    if (!publicKey)
        missingKeys.push("NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY");
    if (!privateKey)
        missingKeys.push("IMAGEKIT_PRIVATE_KEY");
    if (!urlEndpoint)
        missingKeys.push("NEXT_PUBLIC_IMAGEKIT_URL");
    if (missingKeys.length > 0) {
        throw new Error(`ImageKit environment variables are missing on the server: ${missingKeys.join(", ")}. Check your server's .env file and Docker configuration.`);
    }
    return new imagekit_1.default({
        publicKey: publicKey,
        privateKey: privateKey,
        urlEndpoint: urlEndpoint,
    });
};
const getAuthParams = async (req, res) => {
    try {
        const imagekit = getImageKitInstance();
        const result = imagekit.getAuthenticationParameters();
        res.json(result);
    }
    catch (error) {
        console.error("ImageKit Auth Error:", error.message);
        res.status(500).json({ error: error.message });
    }
};
exports.getAuthParams = getAuthParams;
//# sourceMappingURL=imagekit.controller.js.map