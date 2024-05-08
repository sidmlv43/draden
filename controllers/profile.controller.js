const User = require("../models/user.model");
const Address = require("../models/address.model");
const bcrypt = require("bcryptjs");
const {
  fetchAll,
  createOne,
  updateOneForCurrentUser,
} = require("../utils/db.handlers");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");

exports.getAddresses = fetchAll(Address, true);

exports.setCurrentUser = (req, res, next) => {
  req.body.user = req.user;
  next();
};

exports.addNewAddress = createOne(Address);
exports.updateAddress = updateOneForCurrentUser(Address);

exports.changePassword = catchAsync(async (req, res, next) => {
  const { oldPassword, newPassword, passwordConfirm } = req.body;
  const currentUser = await User.findById(req.user._id).select("+password");
  if (
    !currentUser ||
    !(await currentUser.isValidPassword(oldPassword, currentUser.password))
  ) {
    return next(new AppError("Invalid password!", 403));
  }
  if (newPassword !== passwordConfirm) {
    return next(new AppError("Passwords do not match!", 403));
  }

  currentUser.password = newPassword;
  currentUser.passwordConfirm = passwordConfirm;
  await currentUser.save();
  return res.status(201).json({
    status: "success",
    message: "Password updated successfully!",
  });
});
