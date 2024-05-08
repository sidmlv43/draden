const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide a valid category name"],
    unique: true,
  },
  isDeleted: {
    type: Boolean,
    default: false,
    select: false,
  },
});

categorySchema.pre(/^find/, function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

module.exports = mongoose.model("Category", categorySchema);
