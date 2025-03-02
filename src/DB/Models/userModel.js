import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { gender, provider, role } from "../../Constants/constants.js";

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    provider: { type: String, enum: Object.values(provider), required: true },
    gender: { type: String, enum: Object.values(gender), required: true },
    DOB: {
      type: Date,
      required: true,
      validate: {
        validator: function (value) {
          const ageDiff = new Date().getFullYear() - value.getFullYear();
          return ageDiff >= 18;
        },
        message: "User must be at least 18 years old.",
      },
    },
    mobileNumber: { type: String, required: true },
    role: { type: String, enum: Object.values(role), default: "User" },
    isConfirmed: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null },
    bannedAt: { type: Date, default: null },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    changeCredentialTime: { type: Date },
    profilePic: {
      secure_url: { type: String },
      public_id: { type: String },
    },
    coverPic: {
      secure_url: { type: String },
      public_id: { type: String },
    },
    OTP: [
      {
        code: { type: String, required: true },
        type: {
          type: String,
          enum: Object.values(provider),
          required: true,
        },
        expiresIn: { type: Date, required: true },
      },
    ],
  },
  { timestamps: true }
);

// Virtual field for username
userSchema.virtual("username").get(function () {
  return `${this.firstName}${this.lastName}`;
});

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

export const User = mongoose.models.User || mongoose.model("User", userSchema);
