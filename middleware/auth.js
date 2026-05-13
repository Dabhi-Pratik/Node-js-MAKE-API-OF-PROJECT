import HttpError from "./HttpError.js";
import jwt from "jsonwebtoken";
import User from "../model/userModel.js";

const auth = async (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");

    if (!authHeader) {
      return next(new HttpError("Authorization header is Required", 400));
    }

    const token = authHeader.replace("Bearer ", "");

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findOne({
      _id: decoded._id,
      "tokens.token": token,
    });

    if (!user) {
      return next(new HttpError("Please Authenticate", 401));
    }

    req.user = user;
    req.token = token;

    next();
  } catch (error) {
    console.log(error);

    next(new HttpError(error.message, 500));
  }
};

export default auth;
