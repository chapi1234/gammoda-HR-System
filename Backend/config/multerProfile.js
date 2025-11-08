// config/multerProfile.js
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "./cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "profiles",
    resource_type: "image",
    public_id: (req, file) => `${Date.now()}-${file.originalname.split(".")[0]}`,
  },
});

const uploadProfile = multer({ storage });

export default uploadProfile;
