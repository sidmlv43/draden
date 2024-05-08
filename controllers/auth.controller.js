const { promisify } = require("util");
// const jwt = require("jsonwebtoken");
const multer = require("multer");

const User = require("../models/user.model");
const catchAsync = require("../utils/catchAsync");
const jwt = require("jsonwebtoken");
const AppError = require("../utils/AppError");
const { genToken, verifyRefreshToken } = require("../utils/genToken");
const UserToken = require("../models/auth-token.model");
const Email = require("../utils/email.handler");
const { configMulter, fileFilter } = require("../utils/upload.handler");


const multerStorage = configMulter({
  storageType: "diskStorage",
  destination: "user",
});

const filter = fileFilter({fileType: "image"});

const upload = multer({
  storage: multerStorage,
  fileFilter: filter,
});

exports.uploadUserImage = upload.single("photo");

exports.signup = catchAsync(async (req, res, next) => {
  const { name, email, phone, password, passwordConfirm, photo } = req.body;
  const user = await User.create({
    name,
    email,
    phone,
    password,
    passwordConfirm,
    photo
  });

  if (!user) return next(new AppError("Unable to register user", 400));
  user.password = undefined;
  user.passwordConfirm = undefined;
  const url = `${req.protocol}://${req.get("host")}/me`;
  await new Email(user, url).sendWelcome(); // will implement in future.
  return res.status(201).json({
    status: "success",
    message: "Account created successfully. Please login first.",
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: email }).select("+password");
  if (!user || !(await user.isValidPassword(password, user.password))) {
    return next(new AppError("Invalid credentials", 401));
  }

  user.password = undefined;

  const { accessToken, refreshToken } = await genToken(user);

  const cookieOptions = {
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === "production") {
    cookieOptions.secure = true;
  }

  res.cookie("accessToken", accessToken, cookieOptions);
  res.cookie("refreshToken", refreshToken, cookieOptions);

  res
    .status(200)

    .json({
      status: "success",
      accessToken,
      refreshToken,
      data: {
        user,
      },
    });
});

exports.getNewAccessToken = catchAsync(async (req, res, next) => {
  try {
    let refreshToken = "";
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies.refreshToken) {
      refreshToken = req.cookies.refreshToken;
    }

    // console.log("refreshToken = " + refreshToken);

    const {
      tokenDetails: { _id, role },
    } = await verifyRefreshToken(refreshToken);

    const accessToken = jwt.sign({ _id, role }, process.env.JWT_SECRET, {
      expiresIn: "23h",
    });
    res.cookie("accessToken", accessToken, {
      expires: new Date(Date.now() + 15 * 60 * 60 * 1000),
      httpOnly: true,
    });
    res.status(200).json({
      status: "success",
      accessToken,
      message: "Access token successfully created.",
    });
  } catch (err) {
    next(new AppError(err.message, 400));
  }
});

exports.logout = catchAsync(async (req, res, next) => {
  const refreshToken = req.cookies.refreshToken || req.body.refreshToken;
  try {
    const userToken = await UserToken.findOneAndDelete({ token: refreshToken });
    if (!userToken) {
      return res.status(200).json({
        status: "success",
        message: "Successfully logged out",
      });
    }
    // await userToken.remove();
    return res.status(200).json({
      status: "success",
      message: "Successfully logged out",
    });
  } catch (err) {
    next(new AppError(err.message, 400));
  }
});

exports.protect = catchAsync(async (req, res, next) => {
  let accessToken = "";
  let refreshToken = req.body.refreshToken || req.cookies.refreshToken;

  if (
    req.headers.authorization &&
    req.headers.authorization.startswith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.accessToken) {
    accessToken = req.cookies.accessToken;
  }
  if (!accessToken || !refreshToken) {
    return next(new AppError("Access denied. Please login first", 401));
  }

  const decoded = await promisify(jwt.verify)(
    accessToken,
    process.env.JWT_SECRET
  );

  // console.log(decoded);

  const currentSession = await UserToken.findOne({
    token: refreshToken,
    user: decoded._id,
  });

  const freshUser = await User.findById(decoded._id);
  // console.log("session: " + currentSession);

  if (!freshUser || !currentSession) {
    next(new AppError("Please login again to access this resource.", 401));
  }

  req.user = freshUser;
  next();
});

exports.restrictAccessTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError(
          "Access denied. You are not authorized to access this resource",
          403
        )
      );
    }
    next();
  };
};
