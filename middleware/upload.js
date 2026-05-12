import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "Library-Management",
    format: "webp",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation: [
      { height: 600, width: 600, crop: "limit" },
      { quality: "auto" },
    ],
  },
});

const uploads = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

export default uploads
