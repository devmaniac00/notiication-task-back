const express = require("express");
const bodyParser = require("body-parser");
const emailRouter = require("./routers/emailRoutes");
const cors = require("cors");
const mongoose = require("mongoose");

mongoose
  .connect(process.env.MONGO_URI, {})
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB", err);
  });

const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(bodyParser.json());
app.use("/api", emailRouter);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
