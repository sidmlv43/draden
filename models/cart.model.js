const mongoose = require("mongoose");

const {
  Schema,
  Schema: { ObjectId },
} = mongoose;

const cartSchema = new Schema(
  {
    user: {
      type: ObjectId,
      ref: "User",
      required: [true, "A cart must be associated with a user"],
    },
    products: [
      {
        product: {
          type: ObjectId,
          ref: "Product",
        },
        quantity: {
          type: Number,
          default: 1,
          min: 1,
        },
      },
    ],
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  }
);

cartSchema.pre(/^find/, function (next) {
  this.populate({
    path: "products.product",
    select: "name description price",
  });
  next();
});

cartSchema.virtual("cartTotal").get(function () {
  let total = 0;
  this.products.forEach((product) => {
    total += product.quantity * product.product.price;
  });
  return total;
});

module.exports = mongoose.model("Cart", cartSchema);
