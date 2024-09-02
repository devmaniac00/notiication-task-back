const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  candidateName: String,
  email: String,
  notificationInterval: String,
  notificationTime: String,
  relevancyScore: String,
  searchQuery: String,
  weeklyNotificationDay: String,
  sendCount: {
    type: Number,
    default: 0,
  },
  maxSends: {
    type: Number,
    default: 3,
  },
});

const Notification = mongoose.model("Notification", notificationSchema);

module.exports = Notification;
