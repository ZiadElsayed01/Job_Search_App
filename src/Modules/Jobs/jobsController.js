import { Router } from "express";
import { createJob } from "./Services/jobServices.js";
import { authenticationMiddleware } from "../../Middlewares/authenticationMiddleware.js";
import { errorHandlerMiddleware } from "../../Middlewares/errorHandlerMiddleware.js";
const jobsRouter = Router();

jobsRouter.use(errorHandlerMiddleware(authenticationMiddleware()));

// create job
jobsRouter.post("/create-job/:companyId", createJob);

export default jobsRouter;
