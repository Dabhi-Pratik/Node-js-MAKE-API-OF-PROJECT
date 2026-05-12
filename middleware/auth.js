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

    const decode = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findOne({ _id: decode._id, "tokens.token": token });

    if (!user) {
      return next(new HttpError("Please Authentication", 401));
    }

    req.user = user
    req.token = token

    next()
  } catch (error) {
    next(new HttpError(error.message))
  }
};

export default auth
