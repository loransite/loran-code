// LoranBackend/middleware/upload.js
import multer from "multer";
import path from "path";
import fs from "fs";

const getDesignerStorage = (designerId) => {
  const dir = path.join(process.cwd(), "public", "uploads", designerId);
  fs.mkdirSync(dir, { recursive: true });
  return multer.diskStorage({
    destination: (req, file, cb) => cb(null, dir),
    filename: (req, file, cb) => {
      const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, "img-" + unique + path.extname(file.originalname));
    },
  });
};

const uploadDesigner = (req, res, next) => {
  const upload = multer({
    storage: getDesignerStorage(req.user.id),
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
      const allowed = /jpeg|jpg|png|webp/;
      const ext = allowed.test(path.extname(file.originalname).toLowerCase());
      const mime = allowed.test(file.mimetype);
      if (ext && mime) return cb(null, true);
      cb(new Error("Images only"));
    },
  }).single("image");
  upload(req, res, next);
};

export default uploadDesigner;