const express = require("express");
const {
  registerUser,
  loginUser,
  getAllUser,
  updateUser,
} = require("../controllers/userController");
const { isAdmin, authMiddleware} = require("../middlewares/authMiddlware");
const userRouter = express.Router();

// all post routes
userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);

// all get routes
userRouter.get("/all-users",isAdmin, getAllUser);

//all put routes
userRouter.put("/update-profile",authMiddleware, updateUser);



module.exports = userRouter;
