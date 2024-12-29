import dotenv from "dotenv";
dotenv.config();

import {
  responseHandler,
  errorHandler,
  asyncHandler,
  generateTokens,
  options,
  generateVerificationCode,
} from "../utils/index.js";
import { User, Course, Video } from "../models/index.js";
import jwt from "jsonwebtoken";
import {
  registerUserValidation,
  loginUserValidation,
  addCourseValidation,
} from "../validation/index.js";
import { sendVerificationEmail, welcomeEmail } from "../service/index.js";

const registerUser = asyncHandler(async (req, res) => {
  const validatedData = registerUserValidation.parse(req.body);
  const { fullName, email, username, password } = validatedData;

  if (
    [fullName, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new errorHandler(400, "All fields are required");
  }

  const existingUser = await User.findOne({
    $or: [{ email }, { username }],
  });

  if (existingUser) {
    throw new errorHandler(409, "User with email or username already exists");
  }

  const existingAdmin = await User.findOne({ role: "admin" });

  if (!existingAdmin) {
    const admin = await User.create({
      fullName: process.env.ADMIN_FULLNAME,
      email: process.env.ADMIN_EMAIL,
      username: process.env.ADMIN_USERNAME,
      password: process.env.ADMIN_PASSWORD,
      role: "admin",
      isVerified: true,
    });

    const { accessToken, refreshToken } = await generateTokens(admin._id);

    admin.refreshToken = refreshToken;

    const createdAdmin = await User.findById(admin._id).select(
      "-password -refreshToken"
    );

    if (!createdAdmin) {
      throw new errorHandler(
        500,
        "Something went wrong while registering the admin"
      );
    }

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
        new responseHandler(
          200,
          {
            user: createdAdmin,
            accessToken,
            refreshToken,
          },
          "Admin registered successfully"
        )
      );
  }

  const verificationCode = generateVerificationCode();

  const user = await User.create({
    fullName,
    email,
    username: username.toLowerCase(),
    password,
    verificationCode,
  });

  sendVerificationEmail(email, verificationCode, fullName);

  const { accessToken, refreshToken } = await generateTokens(user._id);

  user.refreshToken = refreshToken;

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new errorHandler(
      500,
      "Something went wrong while registering the user"
    );
  }

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new responseHandler(
        200,
        {
          user: createdUser,
          accessToken,
          refreshToken,
        },
        "User registered Successfully"
      )
    );
});

const verifyUser = asyncHandler(async (req, res) => {
  const { verificationCode } = req.body;

  if (!verificationCode) {
    throw new errorHandler(400, "Verification code is required");
  }

  const user = await User.findOne({
    _id: req.user._id,
  });

  if (!user) {
    throw new errorHandler(404, "User not found");
  }

  if (user.verificationCode !== verificationCode) {
    throw new errorHandler(400, "Invalid verification code");
  }

  user.isVerified = true;
  await user.save();

  welcomeEmail(user.email, user.fullName);

  return res
    .status(200)
    .json(new responseHandler(200, {}, "User verified successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  const validatedData = loginUserValidation.parse(req.body);
  const { username, email, password } = validatedData;

  if (!username && !email) {
    throw new errorHandler(400, "username or email is required");
  }

  const user = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (!user) {
    throw new errorHandler(404, "User does not exist");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new errorHandler(401, "Invalid user credentials");
  }

  const { accessToken, refreshToken } = await generateTokens(user._id);

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new responseHandler(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User logged In Successfully"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: 1,
      },
    },
    {
      new: true,
    }
  );

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new responseHandler(200, {}, "User logged Out"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new errorHandler(401, "unauthorized request");
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decodedToken?._id);

    if (!user) {
      throw new errorHandler(401, "Invalid refresh token");
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      throw new errorHandler(401, "Refresh token is expired or used");
    }

    const { accessToken, newRefreshToken } =
      await generateAccessAndRefereshTokens(user._id);

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new responseHandler(
          200,
          { accessToken, refreshToken: newRefreshToken },
          "Access token refreshed"
        )
      );
  } catch (error) {
    throw new errorHandler(401, error?.message || "Invalid refresh token");
  }
});

const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  const user = await User.findById(req.user?._id);
  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

  if (!isPasswordCorrect) {
    throw new errorHandler(400, "Invalid old password");
  }

  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new responseHandler(200, {}, "Password changed successfully"));
});

const getCurrentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new responseHandler(200, req.user, "User fetched successfully"));
});

const updateAccountDetails = asyncHandler(async (req, res) => {
  const { fullName, email } = req.body;

  if (!fullName || !email) {
    throw new errorHandler(400, "All fields are required");
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        fullName,
        email: email,
      },
    },
    { new: true }
  ).select("-password");

  return res
    .status(200)
    .json(
      new responseHandler(200, user, "Account details updated successfully")
    );
});

const applyRole = asyncHandler(async (req, res) => {
  const { role } = req.body;

  if (!role) {
    throw new errorHandler(400, "Role is required");
  }

  const validRoles = ["student", "instructor", "admin"];
  if (!validRoles.includes(role.toLowerCase())) {
    throw new errorHandler(400, "Invalid role provided");
  }

  const fetchedUser = await User.findById(req.user._id);

  if (!fetchedUser) {
    throw new errorHandler(404, "User not found");
  }

  fetchedUser.role = role;
  await fetchedUser.save();

  return res
    .status(200)
    .json(new responseHandler(200, fetchedUser, "Role applied successfully"));
});

const getAllStudents = asyncHandler(async (req, res) => {
  const students = await User.find({ role: "student" });

  return res
    .status(200)
    .json(new responseHandler(200, students, "Students fetched successfully"));
});

const getAllInstructors = asyncHandler(async (req, res) => {
  const instructors = await User.find({ role: "instructor" });

  return res
    .status(200)
    .json(
      new responseHandler(200, instructors, "Instructors fetched successfully")
    );
});

const assignCourseToInstructor = asyncHandler(async (req, res) => {
  const { instructorId, courseId } = req.body;

  if (!instructorId || !courseId) {
    throw new errorHandler(400, "Instructor ID and Course ID are required");
  }

  const course = await Course.findById(courseId);

  if (!course) {
    throw new errorHandler(404, "Course not found");
  }

  const instructor = await User.findById(instructorId);

  if (!instructor) {
    throw new errorHandler(404, "Instructor not found");
  }

  await Course.findByIdAndUpdate(courseId, { instructor: instructorId });
  await User.findByIdAndUpdate(instructorId, {
    $push: { coursesTaught: courseId },
  });

  return res
    .status(200)
    .json(
      new responseHandler(200, {}, "Course assigned to instructor successfully")
    );
});

export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  updateAccountDetails,
  applyRole,
  verifyUser,
  getAllStudents,
  getAllInstructors,
  assignCourseToInstructor,
};
