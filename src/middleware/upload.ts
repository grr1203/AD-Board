import multer from 'multer';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, `${__dirname}/../dist/`);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

export const fileUpload = multer({ storage });
