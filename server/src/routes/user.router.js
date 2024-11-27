import { Router } from "express";
import { registerUser, loginUser, logoutUser, refreshAccessToken, changeCurrentPassword, getCurrentUser, updateAccountDetails, uploadVideo, addCourse, getCourses,getAllCourses, enrollInCourse, getEnrolledCourses, unenrollInCourse, applyRole } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/index.js";
import { registerLimiter, loginLimiter, forgotPasswordLimiter } from "../middlewares/rate_limiter/auth.js";
import { upload } from "../middlewares/index.js";

const router = Router();

router.route('/register').post(registerLimiter, registerUser);
router.route('/login').post(loginLimiter, loginUser);

// Secured routes
router.route('/apply-role').put(verifyJWT, applyRole);
router.route('/logout').post(verifyJWT, logoutUser);
router.route('/refresh-token').post(verifyJWT, refreshAccessToken);
router.route('/change-password').post(verifyJWT, changeCurrentPassword);
router.route('/current-user').get(verifyJWT, getCurrentUser);
router.route('/update-account').put(verifyJWT, updateAccountDetails);
router.route('/upload-video').post(verifyJWT, upload.single('video'), uploadVideo);
router.route('/add-course').post(verifyJWT, addCourse);
router.route('/get-courses').get(verifyJWT, getCourses);
router.route('/get-all-courses').get(verifyJWT, getAllCourses);
router.route('/enroll/:courseId').post(verifyJWT, enrollInCourse);
router.route('/get-enrolled-courses').get(verifyJWT, getEnrolledCourses);
router.route('/unenroll/:courseId').delete(verifyJWT, unenrollInCourse);

export default router;