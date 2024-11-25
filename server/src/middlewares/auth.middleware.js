import { asyncHandler, errorHandler } from "../utils/index.js";
import jwt from "jsonwebtoken"; 
import { User } from "../models/index.js";

const verifyJWT = asyncHandler(async(req, _, next) => {
  try {
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
    console.log(token);

    if (!token) {
        throw new errorHandler(401, "Unauthorized request")
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

    const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
    console.log("user", user);

    if (!user) {
        throw new errorHandler(401, "Invalid Access Token")
    }

    req.user = user;
    next()
  } catch (error) {
    throw new errorHandler(401, error?.message || "Invalid access token")
  }
})

export { verifyJWT }