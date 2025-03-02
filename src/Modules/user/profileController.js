import { Router } from "express";
import { uploadCoverImage, uploadProfileImage } from "./Services/profileServices.js";
import { Multer } from "../../Middlewares/multerMiddleware.js";
import { extension } from "../../Constants/constants.js";
import { authenticationMiddleware } from "../../Middlewares/authenticationMiddleware.js";
const profileRouter = Router();

// uth router
profileRouter.use(authenticationMiddleware());

profileRouter.patch(
  "/upload-profile-image",
  Multer("ProfileImages", extension.IMAGE).single("profile-image"),
  uploadProfileImage
);
profileRouter.patch(
  "/upload-cover-image",
  Multer("CoverImages", extension.IMAGE).array("cover-image", 3),
  uploadCoverImage
);

export default profileRouter;
