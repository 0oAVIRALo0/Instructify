import { Router } from "express";
import { registerUser, loginUser, logoutUser, refreshAccessToken, changeCurrentPassword, getCurrentUser, updateAccountDetails, uploadVideo } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/index.js";
import { uploadOnCloudinary } from "../middlewares/multer.middleware.js";

const router = Router();
const upload = uploadOnCloudinary("videos");

router.route('/register').post(registerUser);
router.route('/login').post(loginUser);

// Secured routes
router.route('/logout').post(verifyJWT, logoutUser);
router.route('/refresh-token').post(verifyJWT, refreshAccessToken);
router.route('/change-password').post(verifyJWT, changeCurrentPassword);
router.route('/current-user').get(verifyJWT, getCurrentUser);
router.route('/update-account').put(verifyJWT, updateAccountDetails);
// router.route('/upload-video').post(verifyJWT, upload.single('file'), uploadVideo);
router.route('/upload-video').post(
  verifyJWT,
  (req, res, next) => {
    console.log("Before multer upload"); // Log before multer
    next();
  },
  upload.single('file'),
  (req, res, next) => {
    console.log("After multer upload:", req.file); // Log after multer
    next();
  },
  uploadVideo
);



export default router;