const Cart = require("../models/cart.model");
const catchAsync = require("../utils/catchAsync");
const { createOne, fetchOne } = require("../utils/db.handlers");

exports.createCart = createOne(Cart);
exports.getCart = catchAsync(async (req, res, next) => {
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    const newCart = new Cart({
      user: req.user._id,
    });
    await newCart.save();
    return res.status(200).json({
      status: "success",
      data: {
        data: {
          cart: newCart,
        },
      },
    });
  }
  return res.status(200).json({
    status: "success",
    data: {
      data: {
        cart,
      },
    },
  });
});

exports.addItemToCart = catchAsync(async (req, res, next) => {
  const { product, quantity } = req.body;
  //   const cartId = req.params.id;
  let existingCart;
  existingCart = await Cart.findOne({
    user: req.user._id,
  });

  //   console.log(existingCart);
  if (!existingCart) {
    existingCart = new Cart({
      user: req.user._id,
    });
    // await existingCart.save();
  }

  const existingItemIndex = existingCart.products.findIndex(
    (prod) => prod.product._id.toString() === product
  );
  if (existingItemIndex >= 0) {
    existingCart.products[existingItemIndex].quantity += quantity;
  } else {
    console.log("qty = ", quantity);
    existingCart.products.push({
      product,
      quantity,
    });
  }

  await existingCart.save();

  return res.status(200).json({
    status: "success",
    data: {
      data: "still api is under development 🏗️",
    },
  });
});

exports.removeItemFromCart = catchAsync(async (req, res, next) => {
  const { product } = req.body;
  let existingCart;
  existingCart = await Cart.findOne({
    user: req.user._id,
  });

  if (!existingCart) {
    return res.status(404).json({
      status: "error",
      message: "Cart not found",
    });
  }
  const updatedCart = existingCart.products.filter(
    (prod) => prod.product._id.toString() === product
  );

  await updatedCart.save();
  return res.status(201).json({
    status: "success",
    data: {
      cart: updatedCart,
    },
  });
});
