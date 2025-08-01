const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { cookie } = require("express-validator");
const mongoose = require("mongoose");
const userRoutes = require("./routes/users");
const jobRoutes = require("./routes/jobs");
const adminRoutes = require("./routes/admin");
const recruiterRoutes = require("./routes/recruiter");
const publicRoutes = require("./routes/public");
const applicationRoutes = require("./routes/applicant");

require("dotenv").config();

const app = express();

mongoose.connect(process.env.MONGO_URL).then(() => {
  console.log("MongoDB connected successfully");
  app.listen(process.env.PORT, () => {
    console.log("Server is running on port 4000");
  });
});

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());

app.get("/", (req, res) => {
  return res.json({ hello: "World this is JOB Post" });
});

app.use("/api", userRoutes);
app.use("/api", publicRoutes);

app.use("/api/recruiter/jobs", recruiterRoutes);
app.use("/api/applicant/", applicationRoutes);
app.use("/api/admin", adminRoutes);
