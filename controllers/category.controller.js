const Category = require("../models/category.model");
const {
  createOne,
  updateOne,
  softDelete,
  fetchAll,
} = require("../utils/db.handlers");

exports.createCategory = createOne(Category);
exports.updateCategory = updateOne(Category);
exports.deleteCategory = softDelete(Category);
exports.fetchAllCategories = fetchAll(Category);
