const mongoose = require("mongoose");

const {
  Schema,
  Schema: { ObjectId },
} = mongoose;

const addressSchema = new Schema({
  user: {
    type: ObjectId,
    ref: "User",
    required: [true, "An address must be associated with a user"],
  },
  houseNumber: {
    type: String,
    required: [true, "An address must have a house number"],
  },
  street: {
    type: String,
    required: [true, "An address must have a street"],
  },
  city: {
    type: String,
    required: [true, "An address must have a city"],
  },

  landmark: {
    type: String,
  },
  postalCode: {
    type: String,
    required: [true, "An address must have a postal code"],
  },
  state: {
    type: String,
    required: [true, "An address must have a state"],
  },
  isDefault: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("Address", addressSchema);
