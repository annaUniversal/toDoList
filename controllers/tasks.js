const Task = require("../models/Task");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError } = require("../errors/bad-request");
const User = require("../models/User");
const { request } = require("express");

const getAllTasks = async (req, res) => {
  const tasks = await Task.find({ createdBy: req.user._id }).sort("createdAt");

  res.render("tasks", { tasks });
};

const showNewForm = async (req, res) => {
  res.render("task", { task: null });
};

const showEditForm = async (req, res) => {
  const userId = req.user._id.toString();
  const taskId = req.params.id;

  const task = await Task.findOne({
    _id: taskId,
  });

  if (!task) {
    req.flash("error", `No task with id: ${taskId}`);
    res.redirect("/tasks");
  }

  res.render("task", { task });
};

const createTask = async (req, res) => {
  req.body.createdBy = req.user._id.toString();
  const { category, taskName, status } = req.body;

  if (category === "" || taskName === "" || status === "") {
    req.flash("error", "All equired fields cannot be empty.");
    res.redirect("/category/new");
  }

  const task = await Task.create({ ...req.body });

  res.redirect("/tasks");
};

const deleteTask = async (req, res) => {
  const { category, taskName, status } = req.body;
  const userId = req.user._id.toString();
  const taskId = req.params.id;

  const task = await Task.findOneAndDelete({
    _id: taskId,
    createdBy: userId,
  });

  if (!task) {
    req.flash("error", `No task with id: ${taskId}`);
    res.redirect("/tasks");
  }

  res.redirect("/tasks");
};

const updateTask = async (req, res) => {
  const { category, taskName, status } = req.body;
  const userId = req.user._id.toString();
  const taskId = req.params.id;

  if (category === "" || taskName === "") {
    //throw new BadRequestError(`The category nor Task name can not be empty`);
    req.flash("error", `All field should be filled in`);
    res.redirect("/tasks");
  }

  // const taskFound = await Task.find({ createdBy: userId, _id: taskId })

  const task = await Task.findOneAndUpdate(
    { _id: taskId, createdBy: userId },
    req.body,
    { new: true, runValidators: true }
  );

  if (!task) {
    //throw new NotFoundError(`No task with id ${taskId}`);
    req.flash("error", `No task with id: ${taskId}`);
    res.redirect("/tasks");
  }

  // res.status(StatusCodes.OK).json({ taskFound });
  res.redirect("/tasks");
};

module.exports = {
  getAllTasks,
  showNewForm,
  showEditForm,
  createTask,
  updateTask,
  deleteTask,

};
