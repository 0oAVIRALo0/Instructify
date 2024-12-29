import dotenv from "dotenv";
dotenv.config();

import { responseHandler, errorHandler, asyncHandler } from "../utils/index.js";
import { User, Course, Video } from "../models/index.js";
import { addCourseValidation } from "../validation/index.js";

const addCourse = asyncHandler(async (req, res) => {
  const validatedData = addCourseValidation.parse(req.body);
  const { title, description, price } = validatedData;

  // console.log("Request Body:", req.body);

  if ([title, description, price].some((field) => field?.trim() === "")) {
    // console.log("Missing fields");
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

  return res
    .status(201)
    .json(new responseHandler(200, course, "Course created successfully"));
});

const getCourses = asyncHandler(async (req, res) => {
  const courses = await Course.find({
    instructor: req.user._id,
  });

  if (!courses) {
    throw new errorHandler(404, "Courses not found");
  }

  return res
    .status(200)
    .json(new responseHandler(200, courses, "Course fetched successfully"));
});

const getAllCourses = asyncHandler(async (req, res) => {
  const courses = await Course.find();

  if (!courses) {
    throw new errorHandler(404, "Courses not found");
  }

  return res
    .status(200)
    .json(new responseHandler(200, courses, "Courses fetched successfully"));
});

const getAssignedCourses = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    throw new errorHandler(404, "User not found");
  }

  let assignedCourses = [];
  for (let courseId of user.coursesTaught) {
    const course = await Course.findById(courseId);
    assignedCourses.push({ instructorId: user._id, courseTitle: course.title });
  }
  console.log("Assigned courses:", assignedCourses);

  return res
    .status(200)
    .json(
      new responseHandler(
        200,
        assignedCourses,
        "Assigned courses fetched successfully"
      )
    );
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

  return res
    .status(200)
    .json(new responseHandler(200, {}, "Unenrolled in course successfully"));
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
    course.studentsEnrolled.push(user._id);
    await course.save();
  }

  return res
    .status(200)
    .json(new responseHandler(200, {}, "Enrolled in course successfully"));
});

const getEnrolledCourses = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate("coursesEnrolled");

  if (!user) {
    throw new errorHandler(404, "User not found");
  }

  return res
    .status(200)
    .json(
      new responseHandler(
        200,
        user.coursesEnrolled,
        "Enrolled courses fetched successfully"
      )
    );
});

export {
  addCourse,
  getCourses,
  getAllCourses,
  getAssignedCourses,
  unenrollInCourse,
  enrollInCourse,
  getEnrolledCourses,
};
