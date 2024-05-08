const mongoose = require("mongoose");

const { ObjectId } = mongoose.Schema.Types;
const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a valid product name"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Please provide a valid product description"],
    },
    price: {
      type: Number,
      required: [true, "Please provide a valid product price"],
    },
    discount: {
      type: Number,
      default: 0,
    },
    category: {
      type: ObjectId,
      ref: "Category",
      required: [true, "Please provide a valid product category"],
    },
    image: {
      type: [String],
      required: [true, "Please provide a valid product image"],
    },
    stock: {
      type: Number,
      required: [true, "Please provide a valid product stock"],
    },
    minimumPurchaseLimit: {
      type: Number,
      default: 1,
    },
    isDeleted: {
      type: Boolean,
      default: false,
      select: false,
    },
  },
  {
    timestamps: true,
  }
);

productSchema.pre("findOne", function (next) {
  this.populate("category");
  next();
});

productSchema.pre(/^find/, function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

module.exports = mongoose.model("Product", productSchema);
