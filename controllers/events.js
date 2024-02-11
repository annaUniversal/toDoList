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
  // const events = await Event.find({ createdBy: req.user._id }).sort(
  //   "eventName"
  // );

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
  const { eventName, status, dueDate } = req.body;

  if (eventName === "" || status === "" || dueDate === "") {
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

const pagination = async (req, res) => {
  try {
    // Fetch events data from your data source
    const events = await Event.find();

    // Define events per page
    const eventsPerPage = 5;

    // Determine current page (e.g., from query parameter)
    const currentPage = parseInt(req.query.page) || 1;

    // Calculate pagination indices
    const startIndex = (currentPage - 1) * eventsPerPage;
    const endIndex = startIndex + eventsPerPage;

    // Slice the events array to get events for the current page
    const paginatedEvents = events.slice(startIndex, endIndex);

    // Pass paginatedEvents, totalPages, and currentPage to the EJS template when rendering
    res.render('events', { events: paginatedEvents, totalPages: Math.ceil(events.length / eventsPerPage), currentPage:0 });
  } catch (err) {
    console.error('Error fetching events:', err);
    res.status(500).send('Internal Server Error');
  }
};



// const addEventtoTask = async (req, res) => {
//   res.render("task", { task: null });
// }

// const addEventtoTask = async (req, res) => {

//   const userId = req.user._id.toString();
//   const eventId = req.params.id;

//   // Retrieve the event by its ID
//   const event = await Event.findById(eventId);
//   if (!event) {
//     return res.status(404).json({ message: "Event not found" });
//   }

//   // Create a new task using the event name as the task name
//   const newTask = await Task.create({
//     taskName: event.eventName, // Set task name as event name
//     createdBy: userId, //  Assign it to the current logged in user
//   });

//   res.render("task", { task });
// };

const updateEvent = async (req, res) => {
  const { eventName, status, dueDate } = req.body;
  const userId = req.user._id.toString();
  const eventId = req.params.id;

  if (eventName === "" || status === "" || dueDate === "") {
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
  pagination,
  // addEventtoTask,
};
