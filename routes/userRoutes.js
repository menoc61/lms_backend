const express = require("express");
const {
  registerUser,
  loginUser,
  getAllUser,
  getAUser,
  updateUser,
  deleteUser,
  blockUser,
  unBlockUser,
  updatePassword,
  forgotPasswordToken,
  resetPassword,
} = require("../controllers/userController");
const { isAdmin, authMiddleware } = require("../middlewares/authMiddlware");
const userRouter = express.Router();

// all post routes
userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.post("/forgot-password", forgotPasswordToken);

// all get routes
userRouter.get("/all-users", isAdmin, getAllUser);
userRouter.delete("/:id", authMiddleware, getAUser);

//all put routes
userRouter.put("/update-profile", authMiddleware, updateUser);
userRouter.put("/block/:id", authMiddleware, isAdmin, blockUser);
userRouter.put("/unblock/:id", authMiddleware, isAdmin, unBlockUser);
userRouter.put("/update-password", authMiddleware, updatePassword);
userRouter.put("/reset-password/:token", resetPassword);

//all delete routes
userRouter.delete("/:id", authMiddleware, isAdmin, deleteUser);

module.exports = userRouter;
