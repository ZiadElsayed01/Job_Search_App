import { Router } from "express";
import {
  gmailLoginService,
  gmailSignUpService,
  logInService,
  logOut,
  refreshToken,
  signUpService,
  verifyEmailService,
} from "./Services/authServices.js";
import { ifUserExists, ifUserNotExists } from "../../Middlewares/userExistenceMiddleware.js";
import { errorHandlerMiddleware } from "../../Middlewares/errorHandlerMiddleware.js";
const authRouter = Router();

authRouter.post("/signup", ifUserExists, errorHandlerMiddleware(signUpService));
authRouter.post("/gmail-signup", errorHandlerMiddleware(gmailSignUpService));
authRouter.post("/verify-email", errorHandlerMiddleware(verifyEmailService));
authRouter.post("/login", ifUserNotExists, errorHandlerMiddleware(logInService));
authRouter.post("/gmail-login", errorHandlerMiddleware(gmailLoginService));
authRouter.post("/refresh-token", errorHandlerMiddleware(refreshToken));
authRouter.post("/logout", errorHandlerMiddleware(logOut));

export default authRouter;
