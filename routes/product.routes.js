const router = require("express").Router();
const { protect, restrictAccessTo } = require("../controllers/auth.controller");
const {
  fetchAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  fetchProductDetail,
  uploadProductImages,
  resizeProductImage,
} = require("../controllers/product.controllers");

router
  .route("/")
  .get(fetchAllProducts)
  .post(
    protect,
    restrictAccessTo("admin"),
    uploadProductImages,
    resizeProductImage,
    createProduct
  );
router
  .route("/:id")
  .get(fetchProductDetail)
  .delete(deleteProduct)
  .patch(updateProduct);

module.exports = router;
