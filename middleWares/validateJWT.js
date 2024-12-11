// desc :middle ware to validate jwt token
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
dotenv.config();

export const validateJWT = (req, res, next) => {
  try {
    //get the tokens from the headder and split to get the token value
    const token = req.headers.authorization.split(" ")[1]; // check if the token is valid

    if (!token) return res.status(401).json("access denied , token missing ");

    //verify the token
    const verified = jwt.verify(token, process.envSECRET_KEY);

    //check if the token is verified
    if (!verified)
      return res.status(401).json("invalid token  , authorisation denied");

    // if the token is verified , move to the next middleware
    next();
  } catch (error) {}
};
