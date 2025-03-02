import { globalErrorHandler } from "../Middlewares/errorHandlerMiddleware.js";
import authRouter from "../Modules/user/authController.js";
import profileRouter from "../Modules/user/profileController.js";

export default function routerHandler(app, express) {
  app.use("/Assets", express.static("Assets"));

  app.use("/auth", authRouter);
  app.use("/user", profileRouter);

  app.get("/", (req, res) => {
    res.status(200).json({ message: "Welcome in Social app" });
  });

  app.all("*", (req, res) => {
    res.status(404).json({ message: "Route not found" });
  });

  app.use(globalErrorHandler);
}
