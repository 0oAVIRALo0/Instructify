import { responseHandler, errorHandler, asyncHandler, generateTokens, options } from "../utils/index.js";
import { User, Course, Video } from "../models/index.js";
import jwt from "jsonwebtoken";
import { registerUserValidation, loginUserValidation, addCourseValidation } from "../validation/index.js";

const registerUser = asyncHandler(async (req, res) => { 
  const validatedData = registerUserValidation.parse(req.body);
  const { fullName, email, username, password } = validatedData;

  if (
    [fullName, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new errorHandler(400, "All fields are required")
  }

  const existingUser = await User.findOne({
    $or: [{ email }, { username }]
  })

  if (existingUser) {
    throw new errorHandler(409, "User with email or username already exists")
  }

  const user = await User.create({
    fullName,
    email,
    username: username.toLowerCase(),
    password
  })

  const { accessToken, refreshToken } = await generateTokens(user._id)
  
  user.refreshToken = refreshToken

  const createdUser = await User.findById(user._id).select("-password -refreshToken")

  if (!createdUser) {
    throw new errorHandler(500, "Something went wrong while registering the user")
  }

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new responseHandler(
        200,
        {
          user: createdUser, accessToken, refreshToken
        },
        "User registered Successfully"
      )
    )
  }
);

const loginUser = asyncHandler(async (req, res) => {
  const validatedData = loginUserValidation.parse(req.body)
  const { username, email, password } = validatedData

  if (!username && !email) {
    throw new errorHandler(400, "username or email is required")
  }

  const user = await User.findOne({
    $or: [{username}, {email}]
  })

  if (!user) {
    throw new errorHandler(404, "User does not exist")
  }

  const isPasswordValid = await user.isPasswordCorrect(password)

  if (!isPasswordValid) {
    throw new errorHandler(401, "Invalid user credentials")
  }

  const {accessToken, refreshToken} = await generateTokens(user._id)

  const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

  return res
  .status(200)
  .cookie("accessToken", accessToken, options)
  .cookie("refreshToken", refreshToken, options)
  .json(
    new responseHandler(
      200, 
      {
          user: loggedInUser, accessToken, refreshToken
      },
      "User logged In Successfully"
    )
  )
})

const logoutUser = asyncHandler(async(req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
          refreshToken: 1
      }
    },
    {
      new: true
    }
  )

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new responseHandler(200, {}, "User logged Out"))
})

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

  if (!incomingRefreshToken) {
      throw new errorHandler(401, "unauthorized request")
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    )

    const user = await User.findById(decodedToken?._id)

    if (!user) {
      throw new errorHandler(401, "Invalid refresh token")
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      throw new errorHandler(401, "Refresh token is expired or used")
        
    }

    const {accessToken, newRefreshToken} = await generateAccessAndRefereshTokens(user._id)

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", newRefreshToken, options)
    .json(
      new responseHandler(
        200, 
        {accessToken, refreshToken: newRefreshToken},
        "Access token refreshed"
      )
    )
  } catch (error) {
      throw new errorHandler(401, error?.message || "Invalid refresh token")
  }
})

const changeCurrentPassword = asyncHandler(async(req, res) => {
  const {oldPassword, newPassword} = req.body

  const user = await User.findById(req.user?._id)
  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)

  if (!isPasswordCorrect) {
      throw new errorHandler(400, "Invalid old password")
  }

  user.password = newPassword
  await user.save({validateBeforeSave: false})

  return res
  .status(200)
  .json(new responseHandler(200, {}, "Password changed successfully"))
})

const getCurrentUser = asyncHandler(async(req, res) => {
  return res
  .status(200)
  .json(new responseHandler(
      200,
      req.user,
      "User fetched successfully"
  ))
})

const updateAccountDetails = asyncHandler(async(req, res) => {
  const {fullName, email} = req.body

  if (!fullName || !email) {
      throw new errorHandler(400, "All fields are required")
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
          fullName,
          email: email
      }
    },
    {new: true}
  ).select("-password")

  return res
  .status(200)
  .json(new responseHandler(200, user, "Account details updated successfully"))
});

const addCourse = asyncHandler(async (req, res) => { 
  const validatedData = addCourseValidation.parse(req.body);
  const { title, description, price } = validatedData;

  console.log("Request Body:", req.body);

  if ([title, description, price].some((field) => field?.trim() === "")) {
    console.log("Missing fields");
    throw new errorHandler(400, "All fields are required");
  }

  const existingCourse = await Course.findOne({
    title: title,
  });

  if (existingCourse) {
    throw new errorHandler(409, "Course already exists");
  }

  const course = await Course.create({
    title,
    description,
    price,
    instructor: req.user._id,
  });

  return res.status(201).json(new responseHandler(200, course, "Course created successfully"));
});

const getCourses = asyncHandler(async (req, res) => { 
  const courses = await Course.find({
    instructor: req.user._id,
  });

  if (!courses) {
    throw new errorHandler(404, "Courses not found");
  }

  return res.status(200).json(new responseHandler(200, courses, "Course fetched successfully"));
});

const getAllCourses = asyncHandler(async (req, res) => { 
  const courses = await Course.find();

  if (!courses) {
    throw new errorHandler(404, "Courses not found");
  }

  return res.status(200).json(new responseHandler(200, courses, "Courses fetched successfully"));
});

const uploadVideo = asyncHandler(async (req, res) => { 
  const { title, description } = req.body;

  console.log("Request Body:", req.body); // Debugging the request payload
  console.log("Uploaded File:", req.file); // Debugging uploaded file

  if (!req.file) {
    console.log("No file uploaded");
    return res.status(400).json({ message: "No file uploaded" });
  }

  if ([title, description].some((field) => field?.trim() === "")) {
    console.log("Missing fields");
    return res.status(400).json({ message: "All fields are required" });
  }

  // const videoUrl = req.file.path;

  const video = await Video.create({
    title,
    description,
    // videoUrl,
    user: req.user._id,
  });

  console.log("Video created:", video);

  return res.status(201).json({
    status: 200,
    data: video,
    message: "Video uploaded successfully",
  });
});

const enrollInCourse = asyncHandler(async (req, res) => { 
  const { courseId } = req.params;

  const course = await Course.findById(courseId);

  if (!course) {
    throw new errorHandler(404, "Course not found");
  }

  const user = await User.findById(req.user._id);

  if (!user) {
    throw new errorHandler(404, "User not found");
  }

  if (user.coursesEnrolled.includes(courseId)) {
    throw new errorHandler(400, "Already enrolled in course");
  }

  user.coursesEnrolled.push(courseId);
  await user.save();

  if (!course.studentsEnrolled.includes(user._id)) {
    course.students.push(user._id);
    await course.save();
  }

  return res.status(200).json(new responseHandler(200, {}, "Enrolled in course successfully"));
});

const getEnrolledCourses = asyncHandler(async (req, res) => { 
  const user = await User.findById(req.user._id).populate("coursesEnrolled");

  if (!user) {
    throw new errorHandler(404, "User not found");
  }

  return res.status(200).json(new responseHandler(200, user.coursesEnrolled, "Enrolled courses fetched successfully"));
});

const unenrollInCourse = asyncHandler(async (req, res) => { 
  // console.log(req.params);
  const { courseId } = req.params;

  const course = await Course.findById(courseId);

  if (!course) {
    throw new errorHandler(404, "Course not found");
  }

  const user = await User.findById(req.user._id);

  if (!user) {
    throw new errorHandler(404, "User not found");
  }

  if (!user.coursesEnrolled.includes(courseId)) {
    throw new errorHandler(400, "Not enrolled in course");
  }

  user.coursesEnrolled = user.coursesEnrolled.filter(
    (course) => course.toString() !== courseId.toString()
  );
  await user.save();

  return res.status(200).json(new responseHandler(200, {}, "Unenrolled in course successfully"));
});

const applyRole = asyncHandler(async (req, res) => {
  console.log("Request Body:", req.body);
  const { role } = req.body;

  if (!role) {
    throw new errorHandler(400, "Role is required");
  }

  const validRoles = ['student', 'instructor'];
  if (!validRoles.includes(role.toLowerCase())) {
    throw new errorHandler(400, "Invalid role provided");
  }

  const fetchedUser = await User.findById(req.user._id);

  if (!fetchedUser) {
    throw new errorHandler(404, "User not found");
  }

  fetchedUser.role = role;
  await fetchedUser.save();

  return res.status(200).json(new responseHandler(200, fetchedUser, "Role applied successfully"));
});

export { 
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  updateAccountDetails,
  uploadVideo,
  addCourse,
  getCourses,
  getAllCourses,
  enrollInCourse,
  getEnrolledCourses,
  unenrollInCourse,
  applyRole
}