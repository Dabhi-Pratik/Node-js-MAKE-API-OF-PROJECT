import mongoose from "mongoose";

const borrowSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    bookId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
    },
    issueDate: {
      type: Date,
      default: Date.now,
    },
    dueDate: {
      type: Date,
    },
    returnDate: {
      type: Date,
    },
    fine: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["Borrowed", "Returned"],
      default: "Borrowed",
    },
  },
  {
    timestamps: true,
  },
);

const Borrow = mongoose.model("Borrow", borrowSchema);

export default Borrow;
