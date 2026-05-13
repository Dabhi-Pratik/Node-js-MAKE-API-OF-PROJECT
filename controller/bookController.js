import Book from "../model/bookModel.js";
import HttpError from "../middleware/HttpError.js";
import cloudinary from "../config/cloudinary.js";


const addBook = async (req, res, next) => {
  try {
    const { bookName, author, totalCopies, availableCopies } = req.body;

    const newBook = {
      bookName,
      author,
      totalCopies,
      availableCopies,
      bookImage: req.file ? req.file.path : null,
      cloudinary_id: req.file ? req.file.filename : null,
    };

    const book = new Book(newBook);

    await book.save();

    res
      .status(201)
      .json({ success: true, message: "Book added Successfully...!", book });
  } catch (error) {
    next(new HttpError(error.message));
  }
};

const getBook = async (req, res, next) => {
  try {
    const books = await Book.find({});

    if (books.length === 0) {
      return next(new HttpError("Book not Available...!", 404));
    }

    res.status(200).json({
      success: true,
      message: "All Book Fetched Successfully...!",
      books,
    });
  } catch (error) {
    next(new HttpError(error.message));
  }
};

const updateBook = async (req, res, next) => {
  try {
    const id = req.params.id;

    const book = await Book.findById(id);

    if (!book) {
      return next(new HttpError("Book not Founded...!", 404));
    }

    const updates = Object.keys(req.body);

    const allowedFiled = [
      "bookName",
      "author",
      "totalCopies",
      "availableCopies",
    ];

    const validUpdate = updates.every((field) => allowedFiled.includes(field));

    if (!validUpdate) {
      return next(new HttpError("Only Allowed Fields are Update.....!"));
    }

    updates.forEach((update) => (book[update] = req.body[update]));

    if (req.file) {
      if (book.cloudinary_id) {
        await cloudinary.uploader.destroy(book.cloudinary_id);
      }

      book.bookImage = req.file.path;
      book.cloudinary_id = req.file.filename;
    }

    await book.save();

    res.status(200).json({
      success: true,
      message: "Book Data Updated Successfully.......!",
      book,
    });
  } catch (error) {
    next(new HttpError(error.message));
  }
};

const deleteBook = async (req, res, next) => {
  try {
    const id = req.params.id;

    const book = await Book.findById(id);

    if (!book) {
      return next(new HttpError("Book not Founded...!", 404));
    }

    if (book.cloudinary_id) {
      await cloudinary.uploader.destroy(book.cloudinary_id);
    }

    await book.deleteOne();

    res
      .status(200)
      .json({ success: true, message: "Book Deleted Successfully..!" });
  } catch (error) {
    next(new HttpError(error.message));
  }
};

export default { addBook, getBook, updateBook, deleteBook };
