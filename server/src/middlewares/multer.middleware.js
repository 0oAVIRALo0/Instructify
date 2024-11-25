import dotenv from 'dotenv';
dotenv.config();

import multer from 'multer';
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from 'cloudinary';

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

const uploadOnCloudinary = (uploadsFolder) => {
	const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: (req, file) => {
      const folderName = uploadsFolder;
      const fileExtension = file.originalname.split('.').pop();
      const publicId = `${folderName}-${Date.now()}`;
      return {
        folder: folderName,
        format: fileExtension,
        public_id: publicId
      };
    }
  });

  // Return multer with cloudinary storage configuration
  return multer({
    storage: storage,
    limits: {
      fileSize: 1024 * 1024 * 20 // 20MB
    }
  });
};


export { uploadOnCloudinary };