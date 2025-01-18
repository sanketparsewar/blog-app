require('dotenv').config();

const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const userRoute = require("./routes/user");
const blogRoute = require("./routes/blog");
const cookieParser = require("cookie-parser");
const Blog = require("./models/blog");
const checkForAuthenticationCookie = require("./middlewares/authentication");
const app = express();
const port = process.env.PORT || 8000;

// mongodb://localhost:27017/blogify
mongoose
  .connect(process.env.MONGO_URL)
  .then((e) => console.log("MongoDb connected"));

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
// this is middleware and we have to write if we want to access the images stored in the public folder
app.use(express.static(path.resolve("./public")));
// here we are passing the name of our cookie
app.use(checkForAuthenticationCookie("token"));

app.get("/", async (req, res) => {
  const allBlogs = await Blog.find({});
  res.render("home", {
    user: req.user,
    blogs: allBlogs,
  });
});

app.use("/user", userRoute);
app.use("/blog", blogRoute);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
