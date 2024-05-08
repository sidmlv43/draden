const mongoose = require("mongoose");

const APIfeatures = require("./ApiFeatures");
const catchAsync = require("./catchAsync");

const AppError = require("./AppError");

exports.softDelete = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc || doc === null) {
      return next(new AppError("No document find with the id passed", 404));
    }

    res.status(204).json({
      status: "succsess",
      data: null,
    });
  });

exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!doc) {
      return next(new AppError("No document found with that ID", 404));
    }
    res.status(200).json({
      status: "success",
      data: {
        data: doc,
      },
    });
  });

exports.updateOneForCurrentUser = (Model) =>
  catchAsync(async (req, res, next) => {
    const filter = { _id: req.params.id, user: req.user._id };
    const update = { ...req.body };
    const doc = await Model.findOneAndUpdate(filter, update, { new: true });

    if (!doc) {
      return next(new AppError("You are not authorized.", 403));
    }
    return res.status(201).json({
      status: "success",
      data: {
        doc,
      },
    });
  });

exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);

    if (!doc) {
      return next(new AppError("unable to create document", 404));
    }
    res.status(201).json({
      status: "success",
      data: {
        data: doc,
      },
    });
  });

exports.fetchOne = (Model) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    const doc = await query;

    if (!doc) {
      return next(new AppError("No document found with that ID", 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        data: doc,
      },
    });
  });

// exports.fetchOneForCurrentUser = (Model) => catchAsync(async (req, res, next) => {
//   let query = Model.findOne({user: req.user._id});
//   if(!doc)
// })

exports.fetchAll = (Model, forCurrentUser = false) =>
  catchAsync(async (req, res, next) => {
    let query = Model.find();
    if (forCurrentUser) {
      console.log(req.user);
      query = Model.find({ user: req.user._id });
    }
    const features = new APIfeatures(query, req.query)
      .filter()
      .sort()
      .limitFields()
      .pagination();

    // const docs = await features.query.explain();
    const docs = await features.query;

    // response;
    res.status(200).json({
      status: "success",
      results: docs.length,
      data: {
        data: docs,
      },
    });
  });
