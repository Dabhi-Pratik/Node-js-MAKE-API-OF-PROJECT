import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: Number,
      required: true,
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  },
);

userSchema.pre("save", async function () {
  const user = this;

  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }
});

userSchema.statics.findByCredential = async function (email, password) {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("Unable to Login");
  }

  const isMatched = await bcrypt.compare(password, user.password);

  if (!isMatched) {
    throw new Error("Unable to Login");
  }

  return user;
};

userSchema.methods.generateAuthToken = async function () {
  try {
    const user = this;

    const token = jwt.sign(
      {
        _id: user._id.toString(),
        role: user.role,
      },
      process.env.JWT_SECRET,
    );

    user.tokens = user.tokens.concat({ token });
    await user.save();
    return token;
  } catch (error) {
    throw new Error(error);
  }
};

userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();

  delete userObject.password;
  delete userObject.createdAt;
  delete userObject.updatedAt;
  delete userObject.tokens;

  return userObject;
};

const User = mongoose.model("User", userSchema);

export default User;
