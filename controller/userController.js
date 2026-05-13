import User from "../model/userModel.js";
import HttpError from "../middleware/HttpError.js";

const addUser = async (req, res, next) => {
  try {
    const { name, email, password, phone, role } = req.body;

    const newUser = {
      name,
      email,
      password,
      phone,
      role,
    };

    const user = new User(newUser);

    const token = await user.generateAuthToken();

    await user.save();

    res.status(201).json({
      success: true,
      message: "User Added Successfully....!",
      user,
      token,
    });
  } catch (error) {
    next(new HttpError(error.message));
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findByCredential(email, password);

    if (!user) {
      return next(new HttpError("User Not Founded...!"));
    }

    const token = await user.generateAuthToken();

    res.status(200).json({
      success: true,
      message: "Successfully Login....!",
      user,
      token,
    });
  } catch (error) {
    next(new HttpError(error.message));
  }
};

const authLogin = async (req, res, next) => {
  try {
    const user = req.user;

    if (!user) {
      return next(new HttpError("Unable to login..!", 401));
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    next(new HttpError(error.message));
  }
};

const logOut = async (req, res, next) => {
  try {
    const user = req.user;

    user.tokens = user.tokens.filter((t) => {
      return t.token !== req.token;
    });

    await user.save();

    res
      .status(200)
      .json({ success: true, message: "Log-Out Successfully.....!" });
  } catch (error) {
    next(new HttpError(error.message));
  }
};

const logOutAll = async (req, res, next) => {
  try {
    req.user.tokens = [];

    await req.user.save();

    res
      .status(200)
      .json({ success: true, message: "User Log-Out from all Devices....!" });
  } catch (error) {
    next(new HttpError(error.message));
  }
};

const update = async (req, res, next) => {
  try {
    let targetedUser = req.params.id || req.user._id.toString();

    const user = await User.findById(targetedUser);

    if (!user) {
      return next(new HttpError("User not Founded....!", 404));
    }

    const updates = Object.keys(req.body);

    let allowedFiled = ["name", "phone", "password"];

    if (req.user.role === "admin" || req.user.role === "super_admin") {
      allowedFiled = [...allowedFiled, "role", "email"];
    }

    if (
      targetedUser !== req.user._id.toString() &&
      req.user.role !== "admin" &&
      req.user.role !== "super_admin"
    ) {
      return next(new HttpError("UnAuthorized Access...!", 401));
    }

    const isValid = updates.every((fields) => allowedFiled.includes(fields));

    if (!isValid) {
      return next(
        new HttpError("Only Allowed fields can be Updated....!", 400),
      );
    }

    updates.forEach((update) => (user[update] = req.body[update]));

    await user.save();

    res.status(200).json({
      success: true,
      message: "User Data Updated Successfully....!",
      user,
    });
  } catch (error) {
    next(new HttpError(error.message));
  }
};

const deleteUser = async (req, res, next) => {
  try {
    let targetedUser = req.params.id || req.user._id.toString();

    const user = await User.findById(targetedUser);

    if (!user) {
      return next(new HttpError("User Data not Founded......!"));
    }

    if (
      targetedUser !== req.user._id.toString() &&
      req.user.role !== "admin" &&
      req.user.role !== "super_admin"
    ) {
      return next(new HttpError("UnAuthorized Access.....!"));
    }

    await User.findByIdAndDelete(targetedUser);

    res.status(200).json({
      success: true,
      message: "User Deleted Successfully...!",
    });
  } catch (error) {
    next(new HttpError(error.message));
  }
};

const getUser = async (req, res, next) => {
  try {
    const user = req.user;

    if (!user) {
      return next(new HttpError("User not Found...!", 404));
    }

    res.status(200).json({
      success: true,
      message: "User Data fetched Successfully...!",
      user,
    });
  } catch (error) {
    next(new HttpError(error.message));
  }
};

const allUser = async (req, res, next) => {
  try {
    const users = await User.find({});

    if (users.length === 0) {
      return next(new HttpError("User not Founded...!", 404));
    }

    res.status(200).json({
      success: true,
      message: "User Data fetched successfully...!",
      length: users.length,
      users,
    });
  } catch (error) {
    next(new HttpError(error.message));
  }
};

export default {
  addUser,
  login,
  logOut,
  logOutAll,
  allUser,
  update,
  deleteUser,
  authLogin,
  getUser,
};
