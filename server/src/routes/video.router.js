import { Router } from "express";
import { uploadVideo, getVideo } from "../controllers/video.controller.js";
import { verifyJWT, verifyRole, upload } from "../middlewares/index.js";

const router = Router();

router.route("/get-video/:videoId").get(verifyJWT, getVideo);
router
  .route("/upload-video")
  .post(
    verifyJWT,
    verifyRole("instructor"),
    upload.fields([{ name: "video", maxCount: 1 }]),
    uploadVideo
  );

export default router;
