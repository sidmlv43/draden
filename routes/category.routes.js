const router = require("express").Router();
const {
  fetchAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/category.controller");
const { protect } = require("../controllers/auth.controller");

router.route("/").get(protect, fetchAllCategories).post(createCategory);
router.route("/:id").patch(updateCategory).delete(deleteCategory);
router.route("/:id/products").get();

module.exports = router;
