const router = require("express").Router();
const {
  signup,
  login,
  getNewAccessToken,
  logout,
  uploadUserImage,
} = require("../controllers/auth.controller");

router.route("/signup").post(uploadUserImage, signup);
router.route("/login").post(login);
router.route("/refresh").post(getNewAccessToken);
router.route("/logout").all(logout);

module.exports = router;
