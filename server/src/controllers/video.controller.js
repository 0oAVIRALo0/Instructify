import dotenv from "dotenv";
dotenv.config();

import {
  responseHandler,
  errorHandler,
  asyncHandler,
  uploadOnCloudinary,
} from "../utils/index.js";
import { Course, Video } from "../models/index.js";

const uploadVideo = asyncHandler(async (req, res) => {
  const { title, description, courseId } = req.body;
  const uploadedVideo = req.files?.video[0]?.path;

  if (!uploadedVideo) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  if ([title, description].some((field) => field?.trim() === "")) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const videoUrl = await uploadOnCloudinary(uploadedVideo);

  if (!videoUrl) {
    return res
      .status(500)
      .json({ message: "Failed to upload video to Cloudinary" });
  }

  // console.log("Video URL:", videoUrl);

  const video = await Video.create({
    title,
    description,
    url: videoUrl,
    instructor: req.user._id,
    course: courseId,
  });

  await Course.findByIdAndUpdate(courseId, { $push: { videos: video._id } });

  return res.status(201).json({
    status: 200,
    data: video,
    message: "Video uploaded successfully",
  });
});

const getVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  const video = await Video.findById(videoId);

  if (!video) {
    throw new errorHandler(404, "Video not found");
  }

  return res
    .status(200)
    .json(new responseHandler(200, video, "Video fetched successfully"));
});

export { uploadVideo, getVideo };
