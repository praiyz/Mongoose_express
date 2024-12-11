import User from "../models/userModels.js";
import * as OTPAuth from "otpauth";

const validateOTP = async (req, res, next) => {
  try {
    const { otp, email } = req.body; // get the otp and email fromm the request body

    console.log(otp, email);
    // if the email or otp is not provided
    if (!email || !otp)
      return res.status(400).json("email and otp are required");
    const user = await User.findOne({ email }); // find the user based on the email
    if (!user) return res.status(404).json("user not found");
    // remove object id wrapper from user._id
    const userId = user._id
      .toString()
      .replace(/^new ObjectId\("(.+)"\)$/, "$1");
    // create a new totp object.
    let totp = new OTPAuth.TOTP({
      issue: "ACNE",
      label: "ALICE",
      algorithm: "SHA1",
      digits: 6,
      period: 300,
      secret: OTPAuth.Secret.fromHex(userId), // use the users id as the secret , should be unknoen
    });
    // verify a token
    let isValid = totp.validate({
      token: otp,
      window: 1,
    });
    console.log(isValid);
    if (isValid === null) return res.status(400).json("invalid otp");
    next(); // if the otp is vald , call the middleware
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export default validateOTP;
