const transporter = require("../config/nodemailerConfig");
const Notification = require("../models/notificationModel");
const schedule = require("node-schedule");

const sendEmail = async (req, res) => {
  const {
    candidateName,
    email,
    notificationInterval,
    notificationTime,
    relevancyScore,
    searchQuery,
    weeklyNotificationDay,
  } = req.body;

  const notification = new Notification({
    candidateName,
    email,
    notificationInterval,
    notificationTime,
    relevancyScore,
    searchQuery,
    weeklyNotificationDay,
  });

  try {
    await notification.save();
  } catch (error) {
    console.log("Error saving to database:", error);
    return res.status(500).send("Failed to save data to database.");
  }

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Notification",
    text: `
          Hello!

          This is ${candidateName}. You've requested notifications about ${searchQuery}.

          Have a great day,

          ${candidateName}`,
  };

  const [hours, minutes] = notificationTime.split(":").map(Number);

  try {
    if (notificationInterval === "daily") {
      schedule.scheduleJob({ hour: hours, minute: minutes }, async () => {
        try {
          await transporter.sendMail(mailOptions);
          console.log("Email was sent (Daily).");
        } catch (error) {
          console.log("Error occurred while sending daily email:", error);
        }
      });
    } else if (notificationInterval === "weekly") {
      schedule.scheduleJob(
        { dayOfWeek: weeklyNotificationDay, hour: hours, minute: minutes },
        async () => {
          try {
            await transporter.sendMail(mailOptions);
            console.log("Email was sent (Weekly).");
          } catch (error) {
            console.log("Error occurred while sending weekly email:", error);
          }
        }
      );
    } else if (notificationInterval === "monthly") {
      schedule.scheduleJob(
        { date: 1, hour: hours, minute: minutes },
        async () => {
          try {
            await transporter.sendMail(mailOptions);
            console.log("Email was sent (Monthly).");
          } catch (error) {
            console.log("Error occurred while sending monthly email:", error);
          }
        }
      );
    }
    res.status(200).send("Notification scheduled successfully.");
  } catch (error) {
    console.log("Error occurred while scheduling email:", error);
    res.status(500).send("Failed to schedule email.");
  }
};

module.exports = sendEmail;
