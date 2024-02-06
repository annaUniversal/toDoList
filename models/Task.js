const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
  category: {
    type: String,
    enum: ["work", "personal"],
  
  },
  taskName: {
    type: String,
    required: [true, "Please, provide the task"],
    maxlength: 250,
  },
  status: {
    type: String,
    enum: ["pending", "inProgress", "declined", "done"],
    default:'pending',
  },
  createdBy:{
    type:mongoose.Types.ObjectId,
    ref:'User',
    required: [true, "Please, provide the user"],
  },
  dueDate: {
    type: Date,
    default: Date.now,
    
  },
  notes: {
    type: String,
    maxlength: 550,
    default: "The comment should not exceed 550 symbols "
  }
},{timestamps:true});


module.exports = mongoose.model('Tasks',TaskSchema)