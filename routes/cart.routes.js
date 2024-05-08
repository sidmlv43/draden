const { protect } = require("../controllers/auth.controller");
const {
  createCart,
  addItemToCart,
  getCart,
} = require("../controllers/cart.controller");

const router = require("express").Router();

router.use(protect);
router.route("/").post(createCart);
router.route("/").get(getCart);
router.route("/add-item").post(addItemToCart);

module.exports = router;
