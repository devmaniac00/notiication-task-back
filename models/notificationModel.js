const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  candidateName: String,
  email: String,
  notificationInterval: String,
  notificationTime: String,
  relevancyScore: String,
  searchQuery: String,
  weeklyNotificationDay: String,
});

const Notification = mongoose.model("Notification", notificationSchema);

module.exports = Notification;
