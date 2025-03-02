import { Router } from "express";
import { uploadCoverImage, uploadProfileImage } from "./Services/userServices.js";
import { Multer } from "../../Middlewares/multerMiddleware.js";
import { extension } from "../../Constants/constants.js";
import { authenticationMiddleware } from "../../Middlewares/authenticationMiddleware.js";
const userRouter = Router();

// uth router
userRouter.use(authenticationMiddleware());

userRouter.patch(
  "/upload-profile-image",
  Multer("ProfileImages", extension.IMAGE).single("profile-image"),
  uploadProfileImage
);
userRouter.patch(
  "/upload-cover-image",
  Multer("CoverImages", extension.IMAGE).array("cover-image", 3),
  uploadCoverImage
);

export default userRouter;
