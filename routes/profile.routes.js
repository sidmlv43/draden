const router = require("express").Router();
const { protect } = require("../controllers/auth.controller");
const {
  addNewAddress,
  getAddresses,
  setCurrentUser,
  updateAddress,
  changePassword,
} = require("../controllers/profile.controller");

router.use(protect);
router
  .route("/my-addresses")
  .get(getAddresses)
  .post(setCurrentUser, addNewAddress);

router.route("/my-addresses/:id").patch(updateAddress);

router.route("/update-password").patch(changePassword);



module.exports = router;
