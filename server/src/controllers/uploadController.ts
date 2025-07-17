// src/controllers/uploadController.ts
import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary with your credentials
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const getCloudinarySignature = (req: AuthRequest, res: Response) => {
    const timestamp = Math.round(new Date().getTime() / 1000);
    
    // This signature proves to Cloudinary that the upload request is from a trusted source
    const signature = cloudinary.utils.api_sign_request(
        { timestamp: timestamp },
        process.env.CLOUDINARY_API_SECRET!
    );

    res.json({ timestamp, signature });
};