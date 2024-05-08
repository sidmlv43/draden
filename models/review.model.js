const mongoose = require("mongoose");

const {
  Schema,
  Schema: { ObjectId },
} = mongoose;

const reviewSchema = new Schema(
  {
    user: {
      type: ObjectId,
      ref: "User",
      required: [true, "A review must be associated with a user"],
    },
    product: {
      type: ObjectId,
      ref: "Product",
      required: [true, "A review must be associated with a product"],
    },
    rating: {
      type: Number,
      required: [true, "A review must have a rating"],
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      // required: [true, "A review must have a comment"],
    },

    isDeleted: {
      type: Boolean,
      default: false,
      select: false,
    },
  },
  { timestamps: true }
);

reviewSchema.index({ product: 1, user: 1 }, { unique: true });

module.exports = mongoose.model("Review", reviewSchema);
