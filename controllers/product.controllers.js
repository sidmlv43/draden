const multer = require("multer");
const Product = require("../models/product.model");
const {
  fetchAll,
  fetchOne,
  createOne,
  softDelete,
  updateOne,
} = require("../utils/db.handlers");
const { configMulter, fileFilter } = require("../utils/upload.handler");
const catchAsync = require("../utils/catchAsync");
const sharp = require("sharp");

const multerStorage = configMulter({ storageType: "memoryStorage" });

const productImageFilter = fileFilter({ fileType: "image" });

const upload = multer({
  storage: multerStorage,
  fileFilter: productImageFilter,
});

exports.uploadProductImages = upload.fields([{ name: "image", maxCount: 5 }]);

exports.resizeProductImage = catchAsync(async (req, res, next) => {
  if (!req.files.image) return next();

  req.body.image = [];
  await Promise.all(
    req.files.image.map(async (file, i) => {
      const filename = `prod-${Math.random() * 1e9}-${Date.now()}-${
        i + 1
      }.jpeg`;
      await sharp(file.buffer)
        .resize(2000, 1333)
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .toFile(`public/images/products/${filename}`);

      req.body.image.push(filename);
    })
  );
  console.log(req.body);
  next();
});

exports.uploadProductImages = upload.fields([
  {
    name: "image",
    maxCount: 6,
  },
]);

exports.fetchAllProducts = fetchAll(Product);
exports.fetchProductDetail = fetchOne(Product);
exports.createProduct = createOne(Product);
exports.deleteProduct = softDelete(Product);
exports.updateProduct = updateOne(Product);
