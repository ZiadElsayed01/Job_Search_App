import mongoose from "mongoose";
import {
  jobLocation,
  seniorityLevel,
  workingTime,
} from "../../Constants/constants.js";

const jobOpportunitySchema = new mongoose.Schema(
  {
    jobTitle: { type: String, required: true },
    jobLocation: {
      type: String,
      enum: Object.values(jobLocation),
      required: true,
    },
    workingTime: {
      type: String,
      enum: Object.values(workingTime),
      required: true,
    },
    seniorityLevel: {
      type: String,
      enum: Object.values(seniorityLevel),
      required: true,
    },
    jobDescription: { type: String, required: true },
    technicalSkills: { type: [String], required: true },
    softSkills: { type: [String], required: true },
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    closed: { type: Boolean, default: false },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
    },
  },
  { timestamps: true }
);

export const JobOpportunity =
  mongoose.models.JobOpportunity ||
  mongoose.model("JobOpportunity", jobOpportunitySchema);
