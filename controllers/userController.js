const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const generateToken = require("../config/jwtToken");
const { validateMongodbId } = require("../config/validateMongoDbId");
const crypto = require("crypto");
const sendEmail = require("./emailcontroller");
/* Create a User */
const registerUser = asyncHandler(async (req, res) => {
  /* Get the email form req.body and find whether a user with email exists or not */
  const email = req.body.email;

  /* Find the user with this email get from req.body */
  const findUser = await User.findOne({ email });
  if (findUser) {
    throw new Error("User already exists!");
  } else {
    /**create user */
    const createUser = await User.create(res.body);
    res.status(200).json({
      status: true,
      message: "User created successfully",
      createUser,
    });
  }
});

// login a user

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  //check if user already exists or not
  const findUser = await User.findOne({ email });
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

//get a user
const getAUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const getProfile = await User.findById(id);
    res.status(200).json({
      status: true,
      message: "User Fetched Successfully",
      getProfile,
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

// Block a user
const blockUser = asyncHandler(async (res, req) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const block = await User.findByIdAndUpdate(
      id,
      { isblocked: true },
      { new: true },
    );
    res.status(200).json({
      status: true,
      message: "profile blocked successfully",
      block,
    });
  } catch (error) {
    throw new Error(error);
  }
});

// unBlock a user
const unBlockUser = asyncHandler(async (res, req) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const unBlock = await User.findByIdAndUpdate(
      id,
      { isblocked: false },
      { new: true },
    );
    res.status(200).json({
      status: true,
      message: "profile unBlocked successfully",
      unBlock,
    });
  } catch (error) {
    throw new Error(error);
  }
});

//Delete a user
const deleteUser = asyncHandler(async (res, req) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    await User.findByIdAndDelete(id);
    res.status(200).json({
      status: true,
      message: "profile deleted successfully",
    });
  } catch (error) {
    throw new Error(error);
  }
});

//update password
const updatePassword = asyncHandler(async (res, req) => {
  const { _id } = req.user;
  const { password } = req.body;
  validateMongodbId(_id);
  try {
    const user = await User.findById(_id);
    if (user && password && (await user.isPasswordMatched(password))) {
      throw new Error("Please provide a new password instead of old one");
    } else {
      user.password = password;
      await user.save();
      res.status(200).json({
        status: true,
        message: "Password updated successfully",
      });
    }
  } catch (error) {
    throw new Error(error);
  }
});

// forgot password token
const forgotPasswordToken = asyncHandler(async (res, req) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) throw new Error("User Not Exists with this email");
  try {
    const token = await user.createPasswordResetToken();
    await user.save();
    const resetLink = `http://localhost:4000/api/user/reset-password/${token}`;
    const data = {
      to: email,
      text: `Hey ${user.firstname} ${user.lastname} (●'◡'●)`,
      subject: "Forget Password",
      html: resetLink,
    };
    sendEmail(data);
    res.status(200), json(resetLink);
  } catch (error) {
    throw new Error(error);
  }
});

// restPassword
const resetPassword = asyncHandler(async (req, res) => {
  const { password } = req.body;
  const { token } = req.params;
  const hashToken = crypto.createHash("sha256").update(token).digest("hex");
  const user = await User.findOne({
    passwordResetToken: hashToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  if (!user) throw new Error("Token Expired, Please try again.");
  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  res.status(200).json({
    status: true,
    message: "Password reset successfully",
  });
});
module.exports = {
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
};
