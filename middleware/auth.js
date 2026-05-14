import HttpError from "./HttpError.js";
import jwt from "jsonwebtoken";
import User from "../model/userModel.js";

const auth = async (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");

    if (!authHeader) {
      return next(new HttpError("Auth Header is Required..!", 401));
    }

    if (!authHeader.startsWith("Bearer ")) {
      return next(new HttpError("Invalid Token Format!", 401));
    }

    const token = authHeader.replace("Bearer ", "");

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findOne({
      _id: decoded._id,
      "tokens.token": token,
    });

    if (!user) {
      return next(new HttpError("Authorization Failed.....", 401));
    }

    req.user = user;
    req.token = token;

    next();
  } catch (error) {
    console.log(error);

    return next(new HttpError("Please Authenticate First..!", 401));
  }
};

export default auth;
