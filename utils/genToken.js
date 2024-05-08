const jwt = require("jsonwebtoken");
const UserToken = require("../models/auth-token.model");

exports.genToken = async (user) => {
  try {
    const payload = { _id: user._id, role: user.role };
    const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "14m",
    });

    const now = new Date(); // Create a new Date object for the current date
    const oneMonthLater = new Date(now); // Create a copy of the "now" Date object
    oneMonthLater.setDate(now.getDate() + 30);

    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
      expiresIn: "30d",
    });
    const userToken = await UserToken.findOneAndDelete({ user: user._id });
    // if (userToken) await userToken.remove();

    await new UserToken({ user: user._id, token: refreshToken }).save();
    return Promise.resolve({ accessToken, refreshToken });
  } catch (err) {
    return Promise.reject(err);
  }
};

exports.verifyRefreshToken = (refreshToken) => {
  const privatekey = process.env.JWT_REFRESH_SECRET;
  return new Promise((resolve, reject) => {
    const userToken = UserToken.findOne({ token: refreshToken })
      .then((doc) => {
        if (!doc) {
          return reject({ err: true, message: "Invalid refresh token" });
        }
        jwt.verify(refreshToken, privatekey, (err, tokenDetails) => {
          if (err) {
            return reject({ err: true, message: "Invalid refresh token" });
          }
          console.log("token details: ", tokenDetails);
          resolve({
            tokenDetails,
            status: "success",
            message: "valid refresh token",
          });
        });
      })
      .catch((err) => reject(err));
  });
};
