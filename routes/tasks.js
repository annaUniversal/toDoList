const express = require("express");
const router = express.Router();
const tasksController = require("../controllers/tasks");

router.get("/", tasksController.getAllTasks); //display all the task listings belonging to this user
router.post("/", tasksController.createTask); //Add a new task listing
router.get("/new", tasksController.showNewForm); //Put up the form to create a new entry
router.get("/edit/:id", tasksController.showEditForm); //(Get a particular entry and show it in the edit box
router.post("/update/:id", tasksController.updateTask); //Update a particular entry
router.post("/delete/:id", tasksController.deleteTask); //Delete an entry
//router.get("/addToTasks", tasksController.addEventtoTask); //Add a new task based on the event

module.exports = router;
