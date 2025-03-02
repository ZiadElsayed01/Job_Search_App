import { compareSync, hashSync } from "bcrypt";
import { sendEmail } from "../../../Services/sendEmail.js";
import { Encryption } from "../../../utils/encryptionAndDecryption.js";
import { User } from "../../../DB/Models/userModel.js";
import {v4 as uuidv4} from "uuid"
import { generateOTP, verifyOTP } from "../../../utils/otpHandler.js";
import { generateToken, verifyToken } from "../../../utils/tokens.js";
import { BlackList } from "../../../DB/Models/blacklistModel.js";
import { OAuth2Client } from "google-auth-library";
import { gender, provider } from "../../../Constants/constants.js";

// SignUp
export const signUpService = async (req, res) => {
  const { username, email, password, phone, DOB, gender, isPrivate } = req.body;

  if (!username || !email || !password || !phone) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const hashPassword = hashSync(password, +process.env.SALT);
  const encryptedPhone = await Encryption({
    value: phone,
    key: process.env.ED_SECRET,
  });

  const OTP = generateOTP();

  const hashOTP = hashSync(OTP, +process.env.SALT);
  const otpExpiration = Date.now() + 10 * 60 * 1000;

  sendEmail.emit("SendEmail", {
    to: email,
    subject: "Email Verification",
    html: `<h1>Hello in Social_app</h1><p>OTP: ${OTP}</p>`,
  });

  const newUser = new User({
    username,
    email: email.toLowerCase(),
    password: hashPassword,
    phone: encryptedPhone,
    DOB,
    gender,
    otp: hashOTP,
    otpExpiration,
    isPrivate,
  });

  await newUser.save();
  res.status(201).json({ message: "User created successfully" });
};

// Google SignUp
export const gmailSignUpService = async (req, res) => {
  const { idToken } = req.body;
  const client = new OAuth2Client();
  const ticket = await client.verifyIdToken({
    idToken,
    audience: process.env.WEB_CLIENT_ID,
  });
  const payload = ticket.getPayload();
  const { email, email_verified, name } = payload;

  if (!email_verified) {
    return res.status(400).json({ message: "Invalid email or not verified" });
  }

  const isEmailAlreadyExists = await User.findOne({ email });

  if (isEmailAlreadyExists) {
    return res.status(400).json({ message: "User already exists" });
  }

  const user = new User({
    email: email.toLowerCase(),
    username: name,
    provider: provider.GOOGLE,
    isVerified: true,
    password: hashSync(uuidv4(), +process.env.SALT),
    DOB: new Date(),
    gender: gender.MALE,
    isPrivate: false, 
  });

  await user.save();
  res.status(201).json({ message: "User created successfully" });
};

// Verify Email
export const verifyEmailService = async (req, res) => {
  const { email, OTP } = req.body;

  if (!email || !OTP) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const user = await User.findOne({
    email,
    isVerified: false,
    otp: { $exists: true },
  });
  if (!user) return res.status(404).json({ message: "User not found or already verified" });

  const isOTPMatched = verifyOTP(OTP, user.otp);

  if (!isOTPMatched) return res.status(400).json({ message: "Invalid OTP" });

  if (user.otpExpiration < Date.now())
    return res.status(400).json({ message: "OTP expired" });

  await User.updateOne(
    { email },
    { $set: { isVerified: true }, $unset: { otp: "" } }
  );
  res.status(200).json({ message: "Email verified successfully" });
};
// Log In
export const logInService = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const isPasswordMatched = compareSync(password, req.user.password);
  if (!isPasswordMatched)
    return res.status(400).json({ message: "Invalid password" });

  const accesstoken = generateToken({
    publicClaims: { _id: req.user.id },
    secretKey: process.env.JWT_SECRET,
    registeredClaims: {
      expiresIn: process.env.JWT_SECRET_EXPIRATION,
      jwtid: uuidv4(),
    },
  });

  const refreshtoken = generateToken({
    publicClaims: { _id: req.user.id },
    secretKey: process.env.REFRESH_JWT_SECRET,
    registeredClaims: {
      expiresIn: process.env.REFRESH_JWT_SECRET_EXPIRATION,
      jwtid: uuidv4(),
    },
  });

  res
    .status(200)
    .json({ message: "Login successful", accesstoken, refreshtoken });
};

// Google Login
export const gmailLoginService = async(req, res) => {
  const { idToken } = req.body;  
  const client = new OAuth2Client();
  const ticket = await client.verifyIdToken({
    idToken,
    audience: process.env.WEB_CLIENT_ID,
  });
  const payload = ticket.getPayload();
  const { email, email_verified } = payload;


  if (!email_verified) {
    return res.status(400).json({ message: "Invalid email or not verified" });
  }

  const user = await User.findOne({ email, provider: provider.GOOGLE });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  const accesstoken = generateToken({
    publicClaims: { _id: user._id },
    secretKey: process.env.JWT_SECRET,
    registeredClaims: {
      expiresIn: process.env.JWT_SECRET_EXPIRATION,
      jwtid: uuidv4(),
    },
  });

  const refreshtoken = generateToken({
    publicClaims: { _id: user._id },
    secretKey: process.env.REFRESH_JWT_SECRET,
    registeredClaims: {
      expiresIn: process.env.REFRESH_JWT_SECRET_EXPIRATION,
      jwtid: uuidv4(),
    },
  });

  res
    .status(200)
    .json({ message: "Login successful", accesstoken, refreshtoken });
}

// Refresh Token
export const refreshToken = (req,res) => {
  const { refreshtoken } = req.headers;

  if (!refreshtoken) {
    return res.status(400).json({ message: "Refresh token is required" });
  }

  const data = verifyToken({token: refreshtoken, secretKey: process.env.REFRESH_JWT_SECRET});

  const accesstoken = generateToken({
    publicClaims: { _id: data._id },
    secretKey: process.env.JWT_SECRET,
    registeredClaims: {
      expiresIn: process.env.JWT_SECRET_EXPIRATION,
      jwtid: uuidv4(),
    },
  });

  res.status(200).json({message: "Token refreshed successfully" , accesstoken , refreshtoken })
}

// Forget Password


// Reset Password


// Log Out
export const logOut = async (req, res) => {
  const { accesstoken, refreshtoken } = req.headers;

  if (!accesstoken || !refreshtoken) {
    return res.status(400).json({ message: "Tokens are required" });
  }

  const docodedData = verifyToken({ token: accesstoken, secretKey: process.env.JWT_SECRET });
  const docodedRefreshData = verifyToken({
    token: refreshtoken,
    secretKey: process.env.REFRESH_JWT_SECRET,
  });

  await BlackList.insertMany([
    {
      tokenId: docodedData.jti,
      expiredAt: docodedRefreshData.exp,
    },
    {
      tokenId: docodedRefreshData.jti,
      expiredAt: docodedRefreshData.exp,
    },
  ]);

  res.status(200).json({ message: "Logged out successfully" });
};