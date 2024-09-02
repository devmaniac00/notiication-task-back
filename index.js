const express = require("express");
const bodyParser = require("body-parser");
const emailRouter = require("./routers/emailRoutes");
const transporter = require("./config/nodemailerConfig");

const mongoose = require("mongoose");

mongoose
  .connect(process.env.MONGO_URI, {})
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB", err);
  });

const testEmail = async () => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: "pykulytskyi.oleh@gmail.com",
      subject: "Test Email",
      text: "This is a test email.",
    });
    console.log("Test email sent successfully");
  } catch (error) {
    console.log("Error sending test email:", error);
  }
};

testEmail();

const app = express();
const port = process.env.PORT;

app.use(bodyParser.json());
app.use("/api", emailRouter);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
