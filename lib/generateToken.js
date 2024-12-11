import jwt from 'jsonwebtoken';
import dotenv from "dotenv"// import the dotenv package
dotenv.config(); // to use the .env file

const generateToken =  async (userId) =>{
return  jwt.sign({userId} , process.env.SECRET_KEY , {expiresIn : "1h"});
};

export default generateToken; 