import mongoose from "mongoose";
import { gender, provider, role } from "../../Constants/constants.js";

const userModel = mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
    },
    DOB: {
      type: Date,
    },
    gender: {
      type: String,
      default: gender.FEMALE,
      enum: Object.values(gender),
    },
    role: {
      type: String,
      default: role.USER,
      enum: Object.values(role),
    },
    isDeactive: {
      type: Boolean,
      default: false,
    },
    profilePicture: String,
    coverPicture: [String],
    provider: {
      type: String,
      default: provider.CREDENTIALS,
      enum: Object.values(provider),
    },
    isPrivate: {
      type: Boolean,
      default: false,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    otp: {
      type: String,
    },
    otpExpiration: {
      type: Date,
    },
  },
  { timestamps: true }
);

export const User = mongoose.models.User || mongoose.model("User", userModel);
