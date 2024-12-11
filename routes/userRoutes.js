import express from "express";
import {
  createUser,
  getAllUsers,
  getSingleUser,
  updateUser,
  deleteUser,
  loginUser,
  sendOTP,
  loginWithOTP
} from "../controllers/userController.js";
import { validateJWT } from "../middleWares/validateJWT.js";
import { loginLimiter } from "../middleWares/loginLimiter.js";
import validateOTP from "../middleWares/validateOTP.js";

const router = express.Router();

// router.get("/", (req,res) => {
//     res.status(200).send("holla")
// });

router.post("/create", createUser);
//loginlimiter is a middle ware that reduces the  umber of requests to the login route
router.post("/login", loginLimiter, loginUser);
// validate jwt is a middle ware that checks if the user has a valid jwt token 
router.get("/", validateJWT, getAllUsers); // get all users
router.get("/:id",  validateJWT, getSingleUser); // get a single user by id
router.patch("/update/:id",  validateJWT,updateUser); // update user by id 
router.patch("/id:" , validateJWT, deleteUser)
router.post("/send-otp" , sendOTP); // send otp to a user email 
router.post("/login-otp", validateOTP, loginWithOTP); // login a user with otp
export default router;
