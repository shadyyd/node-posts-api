const multer = require("multer");
const sharp = require("sharp");
const AppError = require("../utils/AppError");
const fs = require("fs");
const path = require("path");

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError(400, "Not an image! Please upload only images"));
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadImages = (name, count) => {
  return upload.fields([{ name: name, maxCount: count }]);
};

exports.uploadSingleImage = (name) => {
  return upload.single(name);
};

exports.resizeImages = (fieldname) => {
  return async (req, res, next) => {
    const isSingleUpload = req.file != null;
    const files = isSingleUpload ? [req.file] : req.files[fieldname];

    if (!files) return next();

    const resizeOptions = {
      width: Number(req.body.width) || 2000,
      height: Number(req.body.height) || 1333,
    };

    const directory = path.join(__dirname, "../public/img");
    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory, { recursive: true });
    }

    const processedFiles = await Promise.all(
      files.map(async (file, i) => {
        const filename = `api-${Date.now()}-${i + 1}.jpeg`;
        const filePath = path.join(directory, filename);

        await sharp(file.buffer)
          .resize(resizeOptions.width, resizeOptions.height)
          .toFormat("jpeg")
          .jpeg({ quality: 90 })
          .toFile(filePath);

        return { filename, path: filePath };
      })
    );

    if (isSingleUpload) {
      req.file.filename = processedFiles[0].filename;
      req.file.path = processedFiles[0].path;
    } else {
      req.body[fieldname] = processedFiles.map((file) => file.filename);
    }

    next();
  };
};
