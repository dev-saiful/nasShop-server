import fs from "fs";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import { ApiError } from "./apiError.js";
dotenv.config();

// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET, 
});

const imageUpload =async (filePath,foldername)=>{
try {
        // uploading image to cloudinary
        const result = await cloudinary.uploader.upload(filePath,{
            folder:foldername,
        });
    
        // remove from localdisk
        fs.unlinkSync(filePath);
        return {
            secure_url:result.secure_url,
        }
} catch (error) {
    throw new ApiError(500,"Internerl Error");
}

};

export {
    imageUpload,
}