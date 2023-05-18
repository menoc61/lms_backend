const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const generateToken = require("../config/jwtToken");
const { validateMongodbId } = require("../config/validateMongoDbId");
const { request, response } = require("express");
/* Create a User */
const registerUser = asyncHandler(async (req, res) => {
  /* Get the email form req.body and find whether a user with email exists or not */
  const email = req.body.email;

  /* Find the user with this email get from req.body */
  const findUser = await User.findOne({ email });
  if (!findUser) {
    /**create user */
    const createUser = await User.create(res.body);
    res.status(200).json({
      status: true,
      message: "User created successfully",
      createUser,
    });
  } else {
    throw new Error("User already exists!");
  }
});

// login a user

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  //check if user already exists or not
  const findUser = await User.findOne({ email: email });
  if (findUser && (await findUser.isPasswordMatched(password))) {
    res.status(200).json({
      status: true,
      message: "Logged In Successfully",
      token: generateToken(findUser?.id),
      role: findUser?.roles,
      username: `${findUser?.firstname} ${findUser?.lastname}`,
      user_image: findUser?.user_image,
    });
  } else {
    throw new Error("Invalid Crudentials");
  }
});

// Get all users
const getAllUser = asyncHandler(async (req, res) => {
  try {
    const allUser = await User.find();
    res.status(200).json({
      status: true,
      message: "All Users Fetched Successfully",
      allUser,
    });
  } catch (error) {
    throw new Error(error);
  }
});

// update user profile
const updateUser = asyncHandler(async (res, req) => {
  const { _id } = req.user;
  validateMongodbId(_id);
  try {
    const user = await User.findByIdAndUpdate(_id, req.body, { new: true });
    res.status(200).json({
      status: true,
      message: "profile updated successfully",
      user,
    });
  } catch (error) {
    throw new Error(error);
  }
});

//Delete a user
const deleteUser = asyncHandler(async (res, req) => {
  const { id } = req.params;
  try {
    await User.findByIdAndDelete(id);
    res.status(200).json({
      status: true,
      message: "profile updated successfully",
    });
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  registerUser,
  loginUser,
  getAllUser,
  updateUser,
  deleteUser,
};
