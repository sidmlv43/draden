const mongoose = require("mongoose");

const {
  Schema,
  Schema: { ObjectId },
} = mongoose;

const orderSchama = new Schema({
  user: {
    type: ObjectId,
    ref: "User",
    required: [true, "An order must be associated with a user"],
  },

  products: [
    {
      product: {
        type: ObjectId,
        ref: "Product",
        required: [true, "An order must have at least one product"],
      },
      quantity: {
        type: Number,
        required: [true, "An order must have at least one product"],
      },
      price: {
        type: Number,
        required: [true, "please provide a price"],
      },
    },
  ],
  totalPrice: {
    type: Number,
    required: [true, "please provide a total price"],
  },
  address: {
    type: String,
    required: [true, "Please provide an address"],
  },

  paymentType: {
    type: String,
    required: [true, "Please provide a payment type"],
    enum: ["COD", "credit card", "debit card"],
  },

  paymentStatus: {
    type: String,
    required: [true, "Please provide a payment status"],
    enum: ["pending", "paid"],
  },

  orderStatus: {
    type: String,
    enum: ["pending", "shipped", "delivered", "cancelled"],
    default: "pending",
  },
});

module.exports = mongoose.model("Order", orderSchama);
