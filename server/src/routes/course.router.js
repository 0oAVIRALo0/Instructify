import { Router } from "express";
import {
  addCourse,
  getCourses,
  getAllCourses,
  getAssignedCourses,
  unenrollInCourse,
  enrollInCourse,
  getEnrolledCourses,
} from "../controllers/course.controller.js";
import { verifyJWT } from "../middlewares/index.js";

const router = Router();

router.route("/get-all-courses").get(verifyJWT, getAllCourses);
router.route("/add-course").post(verifyJWT, addCourse);
router.route("/get-courses").get(verifyJWT, getCourses);
router.route("/get-assigned-courses").get(verifyJWT, getAssignedCourses);
router.route("/unenroll/:courseId").delete(verifyJWT, unenrollInCourse);
router.route("/enroll/:courseId").post(verifyJWT, enrollInCourse);
router.route("/get-enrolled-courses").get(verifyJWT, getEnrolledCourses);

export default router;
