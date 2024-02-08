const Event = require("../models/Event");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError } = require("../errors/bad-request");
const User = require("../models/User");
const { request } = require("express");

const getEveryoneEvents = async (req, res) => {
  const events = await Event.sort("dueDate");

  res.render("events", { events });
};

const getAllEvents = async (req, res) => {
  const events = await Event.find({ createdBy: req.user._id }).sort("eventName");

  res.render("events", { events });
};

const showNewForm = async (req, res) => {
  res.render("event", { event: null });
};

const showEditForm = async (req, res) => {
  const userId = req.user._id.toString();
  const eventId = req.params.id;

  const event = await Event.findOne({
    _id: eventId,
  });

  if (!event) {
    req.flash("error", `No event with id: ${eventId}`);
    res.redirect("/events");
  }

  res.render("event", { event });
};

const createEvent = async (req, res) => {
  req.body.createdBy = req.user._id.toString();
  const { eventName, status,  dueDate } = req.body;

  if (eventName === "" || status === "" || dueDate ==="") {
    req.flash("error", "All equired fields cannot be empty.");
    res.redirect("/events/new");
  }

  const event = await Event.create({ ...req.body });

  res.redirect("/events");
};

const deleteEvent = async (req, res) => {
  const { eventName, status, dueDate } = req.body;
  const userId = req.user._id.toString();
  const eventId = req.params.id;

  const event = await Event.findOneAndDelete({
    _id: eventId,
    createdBy: userId,
  });

  if (!event) {
    req.flash("error", `No event with id: ${eventId}`);
    res.redirect("/events");
  }

  res.redirect("/events");
};

const updateEvent = async (req, res) => {
  const { eventName, status, dueDate } = req.body;
  const userId = req.user._id.toString();
  const eventId = req.params.id;

  if (eventName === "" || status=== "" || dueDate === "") {
    req.flash("error", `All field should be filled in`);
    res.redirect("/events");
  }

  const event = await Event.findOneAndUpdate(
    { _id: eventId, createdBy: userId },
    req.body,
    { new: true, runValidators: true }
  );

  if (!event) {
    req.flash("error", `No event with id: ${eventId}`);
    res.redirect("/events");
  }

  res.redirect("/events");
};

module.exports = {
  getEveryoneEvents,
  getAllEvents,
  showNewForm,
  showEditForm,
  createEvent,
  updateEvent,
  deleteEvent,

};
