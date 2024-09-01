import { Router } from "express";
import multer from "multer";
import {ApiError} from "../utils/apiError.js";
import {ApiResponse} from "../utils/apiResponse.js";
import { storage } from "../utils/cloudinary.js";

const uploadRoute = Router();

const upload = multer({ storage });

const uploadSingleImage = upload.single('image');

uploadRoute.post("/", (req, res) => {
  uploadSingleImage(req, res, async function (err) {
      if (err) {
          return res.status(400).json(new ApiError(400, err.message));
      }
      if (!req.file) {
          return res.status(400).json(new ApiError(400, "No file uploaded"));
      }
    //   uploading in cloudinary
      res.status(200).json(
          new ApiResponse(200, `${req.file.path}` , "Image uploaded successfully")
      );
  });
});


export default uploadRoute;