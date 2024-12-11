import generateToken from "../lib/generateToken.js";
import User from "../models/userModels.js";
import bcrypt from "bcrypt";
import { generateOTP } from "../lib/generateOTP.js";
import nodemailer from "nodemailer";
export const createUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).send("Username already exist");
    }
    const user = new User(req.body);
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    user.password = hashedPassword;
    await user.save();
    res.status(201).json("User created successfully");
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json("user not found");

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) return res.status(400).json("invalid password");
    // generate jwt token if user is authenticated
    const token = await generateToken(user._id); // generate a token based on the user id

    res.status(200).json({
      message: "user logged in sucessfully",
      token: token,
    }); // send a success message
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, { password: false });
    if (!users) return res.status(404).json("No users found");

    res.status(200).json(users);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
export const sendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json("user not found");

    // Remove ObjectId wrapper from user._id
    const userId = user._id
      .toString()
      .replace(/^new ObjectId\("(.+)"\)$/, "$1");

    //generate otp and pass userid to it

    const otp = await generateOTP(userId);
    // create reusable transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: "praiseolatunji22@gmail.com",
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });
    // login with otp

    // send mail with defined transport object
    const mailOptions = {
      from: "praiseolatunji22@gmail.com",
      to: user.email,
      subject: "Hello from Nodemailer",
      text: "This is a test email sent using Nodemailer.",
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email: ", error);
      } else {
        console.log("Email sent: ", info.response);
        res.status(200).json({ message: "otp sent sucessfully", OTP: otp });
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const loginWithOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json("user not found");
    // Remove ObjectId wrapper from user._id
    const userId = user._id
      .toString()
      .replace(/^new ObjectId\("(.+)"\)$/, "$1");

    // generate jwt token if user is authenticated
    const token = await generateToken(userId); // generate token based on the user id
    res.status(200).json({
      message: "user logged in sucessfully with otp",
      token: token,
    }); // send a success message
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const getSingleUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id, { password: false });
    if (!user) return res.status(404).json("User not found");

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json("user id is required");

    const data = req.body;
    if (!data) return res.status(404).json("user not found");

    const user = await User.findByIdAndUpdate(id, data);
    if (!user) return res.status(404).json("user not found");

    User.save();
    res.status(200).json("user updated sucessfully");
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const deleteUser = await User.findByIdAndDelete(id);
    return res.status(200).json(deleteUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
