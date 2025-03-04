import mongoose from "mongoose";
import { gender, provider, role, type } from "../../Constants/constants.js";
import { Decryption, Encryption } from "../../utils/encryptionAndDecryption.js";
import { hash, hashSync } from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    provider: {
      type: String,
      enum: Object.values(provider),
      default: provider.CREDENTIALS,
    },
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
    role: { type: String, enum: Object.values(role), default: role.USER },
    isConfirmed: { type: Boolean, default: false },
    deleted: { type: Boolean, default: false },
    deletedAt: { type: Date },
    bannedAt: { type: Date },
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
        code: { type: String },
        type: {
          type: String,
          enum: Object.values(type),
          required: true,
        },
        expiresIn: { type: Date },
      },
    ],
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// Virtual field for username
userSchema.virtual("username").get(function () {
  const username = `${this.firstName} ${this.lastName}`;
  return username;
});

// Middleware to include firstName and lastName when username is needed
userSchema.pre(/^find/, function (next) {
  // Check if the query is selecting the username virtual field
  if (this._fields && this._fields.username) {
    // Include firstName and lastName in the query
    this.select("firstName lastName");
  }
  next();
});

userSchema.pre("save", async function () {
  const changes = this.getChanges()["$set"];
  if (changes.password) {
    this.password = hashSync(this.password, +process.env.SALT);
  }
  if (changes.mobileNumber) {
    this.mobileNumber = await Encryption({
      value: this.mobileNumber,
      key: process.env.ED_SECRET,
    });
  }
});

userSchema.pre("findOneAndUpdate", async function (next) {
  const update = this._update.mobileNumber;
  if (update) {
    this._update.mobileNumber = await Encryption({
      value: update,
      key: process.env.ED_SECRET,
    });
  }
});

userSchema.post(
  ["findOneAndUpdate", "find", "findOne"],
  async function (doc) {
    if (this.op === "find") {
      doc.forEach(async (doc) => {
        doc.mobileNumber = await Decryption({
          cipher: doc.mobileNumber,
          key: process.env.ED_SECRET,
        });
      });
    } else if (doc && doc.mobileNumber) {
      doc.mobileNumber = await Decryption({
        cipher: doc.mobileNumber,
        key: process.env.ED_SECRET,
      });
    }
  }
);

export const User = mongoose.models.User || mongoose.model("User", userSchema);
