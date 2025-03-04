import { globalErrorHandler } from "../Middlewares/errorHandlerMiddleware.js";
import userRouter from "../Modules/User/userController.js";
import authRouter from "../Modules/Auth/authController.js";

export default function routerHandler(app, express) {
  app.use("/auth", authRouter);
  app.use("/user", userRouter);

  app.get("/", (req, res) => {
    res.status(200).json({ message: "Welcome in Social app" });
  });

  app.all("*", (req, res) => {
    res.status(404).json({ message: "Route not found" });
  });

  app.use(globalErrorHandler);
}
