const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema({
  eventName: {
    type: String,
    required: [true, "Please, provide the event"],
    maxlength: 250,
  },
  status: {
    type: String,
    enum: ["pending", "going", "maybe", "declined"],
    default:'pending',
  },
  createdBy:{
    type:mongoose.Types.ObjectId,
    ref:'User',
    required: [true, "Please, provide the user"],
  },
  dueDate: {
    type: Date,
    required: [true, "Please, provide the date of event"],
  },
  description: {
    type: String,
    maxlength: 550,
    required: [true, "Please, provide the event description"],
  }
},{timestamps:true});


module.exports = mongoose.model('Events',EventSchema)