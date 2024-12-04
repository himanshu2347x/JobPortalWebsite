import multer from "multer";
import path from "path";

// Configure multer to store the files in a specific location
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads"); // Set the directory where files will be stored
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Customize the filename
  },
});

const upload = multer({ storage });

// Export it for use in routes
export default upload;
