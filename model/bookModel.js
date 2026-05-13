import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
  {
    bookName: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    totalCopies: {
      type: Number,
      required: true,
    },
    availableCopies: {
      type: Number,
      required: true,
    },
    bookImage: {
      type: String,
    },
    cloudinary_id: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

const Book = mongoose.model("Book", bookSchema);

export default Book;
