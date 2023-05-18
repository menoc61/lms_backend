const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

const authMiddleware = asyncHandler(async (req, res, next) => {
  let token;
  if (req?.headers?.authorization?.startsWith("Bearer")) {
    token = req?.headers?.authorization?.split(" ")[1];
    try {
      if (token) {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const user = await User.findById(decoded?.id);
        req.user = user;
        next();
      }
    } catch (error) {
      throw new Error("Not authorized, Please Login Again");
    }
  } else {
    throw new Error("There is no token attacked to the header ...");
  }
});

const isAdmin = asyncHandler(async (req, res, next) => {
  const { email } = req.user;
  const isAdmin = await User.findOne({ email: email });
  if (isAdmin.roles === "admin") {
    next();
  } else {
    throw new Error("You are not an Administrator");
  }
});

const isIntructor = asyncHandler(async (req, res, next) => {
  const { email } = req.user;
  const isIntructor = await User.findOne({ email: email });
  if (isIntructor.roles === "instructor") {
    next();
  } else {
    throw new Error("You are not an Instrictor");
  }
});

module.exports = { authMiddleware, isAdmin, isIntructor };
