const express = require("express");
const router = express.Router();
const eventsController = require("../controllers/events");
const Event = require('../models/Event'); // Import your Event model or use whatever method you use to fetch events


router.get("/", eventsController.getAllEvents); //display all the event listings belonging to this user
// router.get("/everyone", eventsController.getEveryoneEvents); //display all the event listings belonging to this user
router.post("/", eventsController.createEvent); //Add a new event listing
router.get("/new", eventsController.showNewForm); //Put up the form to create a new entry
router.get("/edit/:id", eventsController.showEditForm); //(Get a particular entry and show it in the edit box
router.post("/update/:id", eventsController.updateEvent); //Update a particular entry
router.post("/delete/:id", eventsController.deleteEvent); //Delete an entry
// router.post("/addToTasks", eventsController.addEventtoTask); //Add a new task based on the event
router.get('/events', eventsController.pagination);


module.exports = router;
