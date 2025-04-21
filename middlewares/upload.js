import multer from 'multer';
import path from 'path';
const storage = multer.diskStorage({});
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|mp4|mov|avi/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);
  const maxSize = 5 * 1024 * 1024; // 5 MB size limit
if (file.size > maxSize) {
    return cb(new Error('File size exceeds 5 MB limit'));
  }
  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Only images and videos are allowed.'));
  }
};
const upload = multer({ storage, fileFilter });
export default upload;
