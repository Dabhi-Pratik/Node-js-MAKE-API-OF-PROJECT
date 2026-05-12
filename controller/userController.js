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
      phone,
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

    res
      .status(200)
      .json({ success: true, message: "Successfully login....!", user });
  } catch (error) {
    next(new HttpError(error.message));
  }
};

export default { addUser, login };
