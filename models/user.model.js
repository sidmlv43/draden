const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const {
  Schema,
  //   Schema: { ObjectId },
} = mongoose;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "A user must have a name."],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "A user must have an email."],
      // trim: true,
      unique: true,
      validate: [validator.isEmail, "Please enter a valid email."],
    },
    phone: {
      type: String,
      unique: true,
      validate: [validator.isMobilePhone, "Please enter a valid phone number."],
    },

    photo: {
      type: String,
      default:
        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
    },

    password: {
      type: String,
      required: [true, "A user must have a password."],
      select: false,
      // in fucture, please implement a validation logic for a strong password
    },
    passwordConfirm: {
      type: String,
      required: [true, "Please confirm your password"],
      validate: {
        validator: function (val) {
          return this.password === val;
        },
        message: "Passwords do not match.",
      },
    },
    role: {
      type: String,
      default: "user",
      enum: ["user", "admin"],
    },

    passwordResetToken: String,
    passwordResetExpires: Date,
    passwordUpdatedAt: Date,
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  this.password = await bcrypt.hash(this.password, 13);
  this.passwordConfirm = undefined;
});

userSchema.methods.isValidPassword = async function (
  enteredPassword,
  savedPassword
) {
  return await bcrypt.compare(enteredPassword, savedPassword);
};

userSchema.methods.generatePasswordResetToken = async function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.passwordResetExpires = Date.now() + (600000 + 19800 * 1000);
  return resetToken;
};

module.exports = mongoose.model("User", userSchema);
