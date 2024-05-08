const multer = require("multer");
const AppError = require("./AppError");

exports.configMulter = ({ storageType = "memoryStorage", destination }) => {
  if (storageType === "memoryStorage") {
    return multer.memoryStorage();
  }

  if (storageType === "diskStorage") {
    return multer.diskStorage({
      destination: function (req, file, cb) {
        console.log(file);
        cb(null, `${__dirname}/../public/images/${destination}`);
      },
      filename: function (req, file, cb) {
        // const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const fileName = `${destination}-${Date.now()}+photo-${
          Math.random() * 1e9
        }.${file.originalname.split(".")[1]}`;

        req.body[file.fieldname] = `images/${destination}`;
        cb(null, fileName);
      },
    });
  }
};

exports.fileFilter = ({ fileType = "image" }) => {
  return (req, file, cb) => {
    if (file.mimetype.startsWith(fileType)) {
      cb(null, true);
    } else {
      cb(
        new AppError("Invalid file type, Please upload image file", 400),
        false
      );
    }
  };
};

// const multerStorage = multer.memoryStorage();

// const multerFilter = (req, file, cb) => {
//   if (file.mimetype.startsWith("image")) {
//     cb(null, true);
//   } else {
//     cb(new AppError("Invalid file type, Please upload image file", 400), false);
//   }
// };

// const upload = multer({
//   storage: multerStorage,
//   fileFilter: multerFilter,
// });

// exports.uploadTourImages = upload.fields([
//   {
//     name: "imageCover",
//     maxCount: 1,
//   },
//   {
//     name: "images",
//     maxCount: 3,
//   },
// ]);
