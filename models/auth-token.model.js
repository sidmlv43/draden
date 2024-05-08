const mongoose = require("mongoose");

const {
  Schema,
  Schema: { ObjectId },
} = mongoose;

const userTokenSchema = new Schema({
  user: {
    type: ObjectId,
    ref: "User",
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 30 * 86400,
  },
});

const UserToken = mongoose.model("UserToken", userTokenSchema);

module.exports = UserToken;
