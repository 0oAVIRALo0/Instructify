import { responseHandler, errorHandler, asyncHandler, generateTokens } from "../utils/index.js";
import { User } from "../models/index.js";
import jwt from "jsonwebtoken";

const registerUser = asyncHandler(async (req, res) => { 
  const {fullName, email, username, role, password } = req.body

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
    role,
    password
  })

  const createdUser = await User.findById(user._id).select("-password -refreshToken")

  if (!createdUser) {
    throw new errorHandler(500, "Something went wrong while registering the user")
  }

  return res.status(201).json(
    new responseHandler(200, createdUser, "User registered Successfully")
  )
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, username, password } = req.body

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

  const options = {
    httpOnly: true,
    secure: true
  }

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

  const options = {
    httpOnly: true,
    secure: true
  }

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

    const options = {
      httpOnly: true,
      secure: true
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

const uploadVideo = asyncHandler(async (req, res) => { 
  console.log("uploadVideo function called"); // Check if this is logged

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

  const videoUrl = req.file.path;

  const video = await Video.create({
    title,
    description,
    videoUrl,
    user: req.user._id,
  });

  console.log("Video created:", video);

  return res.status(201).json({
    status: 200,
    data: video,
    message: "Video uploaded successfully",
  });
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
}