import { compareSync } from "bcrypt";

export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const verifyOTP = (plainOTP, hashedOTP) => {
  return compareSync(plainOTP, hashedOTP);
};

