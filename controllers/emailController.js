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

  const daysOfWeek = {
    sunday: 0,
    monday: 1,
    tuesday: 2,
    wednesday: 3,
    thursday: 4,
    friday: 5,
    saturday: 6,
  };

  const dayOfWeek = daysOfWeek[weeklyNotificationDay.toLowerCase()];
  if (dayOfWeek === undefined) {
    return res.status(400).send("Invalid day of the week.");
  }

  const [hours, minutes] = notificationTime.split(":").map(Number);

  const scheduleJob = (notificationDate) => {
    console.log("notificationDate", notificationDate);
    schedule.scheduleJob(notificationDate, async () => {
      console.log("Will send?");
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
      console.log("email was sended");

      try {
        await transporter.sendMail(mailOptions);

        const updatedNotification = await Notification.findById(
          notification._id
        );
        if (updatedNotification.sendCount < updatedNotification.maxSends) {
          updatedNotification.sendCount += 1;
          await updatedNotification.save();

          planNextSend(updatedNotification);
        }
      } catch (error) {
        console.log("Error occurred:", error);
      }
    });
  };

  const planNextSend = (notification) => {
    const now = new Date();
    let nextSendDate;

    switch (notification.notificationInterval) {
      case "daily":
        nextSendDate = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate() + 1,
          hours,
          minutes
        );
        break;
      case "weekly":
        nextSendDate = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate() + ((dayOfWeek + 7 - now.getDay()) % 7),
          hours,
          minutes
        );
        break;
      case "monthly":
        nextSendDate = new Date(
          now.getFullYear(),
          now.getMonth() + 1,
          now.getDate(),
          hours,
          minutes
        );
        break;
      default:
        console.log("Invalid notification interval.");
        return;
    }

    scheduleJob(nextSendDate);
  };

  planNextSend(notification);

  res.send("Email scheduling initiated.");
};

module.exports = sendEmail;
