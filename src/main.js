import express from "express";
import { config } from "dotenv";
import routerHandler from "./utils/routerHandler.js";
import dataBaseConnection from "./DB/connection.js";
config();
import cors from "cors";
import "./CronJobs/deleteExpiredOTPs.js";

const whitelist = [process.env.CORS_ORIGIN, undefined];
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};

const bootstrap = () => {
  const app = express();
  app.use(express.json());
  app.use(cors(corsOptions));

  routerHandler(app, express);
  dataBaseConnection();

  app.listen(process.env.PORT, () => {
    console.log(`Server is running in port ${process.env.PORT}`);
  });
};

export default bootstrap;
