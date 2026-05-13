import Book from "../model/bookModel.js";
import Borrow from "../model/borrowModel.js";
import HttpError from "../middleware/HttpError.js";

const borrowBook = async (req, res, next) => {
  try {
    const { bookId, dueDate } = req.body;

    const userId = req.user._id;

    if (!bookId || !dueDate) {
      return next(new HttpError("Book Id and DueDate are Required..!", 400));
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const selectedDueDate = new Date(dueDate + "T00:00:00");
    selectedDueDate.setHours(0, 0, 0, 0);

    if (selectedDueDate <= today) {
      return next(new HttpError("Due date must be future date", 400));
    }

    const book = await Book.findById(bookId);

    if (!book) {
      return next(new HttpError("Book not Found...!", 404));
    }

    if (book.availableCopies <= 0) {
      return next(new HttpError("Book is Out of Sto ck...!", 409));
    }

    const alreadyBorrowed = await Borrow.findOne({
      userId,
      bookId,
      status: "Borrowed",
    });

    if (alreadyBorrowed) {
      return next(new HttpError("You Already Borrowed this Book", 409));
    }

    const newBorrow = {
      userId,
      bookId,
      issueDate: new Date(),
      dueDate: new Date(dueDate),
      status: "Borrowed",
    };

    const borrow = new Borrow(newBorrow);

    await borrow.save();

    book.availableCopies -= 1;

    await book.save();

    await borrow.populate([
      {
        path: "userId",
        select: "name email",
      },
      {
        path: "bookId",
        select: "bookName author ",
      },
    ]);

    res.status(200).json({
      success: true,
      message: "Book Borrowed Successfully..!",
      borrow,
    });
  } catch (error) {
    next(new HttpError(error.message));
  }
};

const returnBook = async (req, res, next) => {
  try {
    const { borrowId } = req.body;

    if (!borrowId) {
      return next(new HttpError("Borrow id is Required..!", 400));
    }

    const borrowBook = await Borrow.findById(borrowId);

    if (!borrowBook) {
      return next(new HttpError("Borrow Recode not Found..!", 404));
    }

    if (borrowBook.status === "Returned") {
      return next(new HttpError("Book already Returned....!", 409));
    }

    borrowBook.status = "Returned";
    borrowBook.returnDate = new Date();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (today > borrowBook.dueDate) {
      const lateDays = Math.ceil(
        (today - borrowBook.dueDate) / (1000 * 60 * 60 * 24),
      );

      borrowBook.fine = lateDays * 10;
    }

    await borrowBook.save();

    const book = await Book.findById(borrowBook.bookId);

    if (book) {
      book.availableCopies += 1;
      await book.save();
    }

    await borrowBook.populate([
      {
        path: "userId",
        select: "name email",
      },
      {
        path: "bookId",
        select: "bookName author",
      },
    ]);

    res.status(200).json({
      success: true,
      message: "Book Returned Successfully..!",
      borrowBook,
    });
  } catch (error) {
    next(new HttpError(error.message));
  }
};

const borrowHistory = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const history = await Borrow.find({
      userId,
    })
      .populate({ path: "bookId", select: "bookName author " })
      .sort({ createdAt: -1 });

    res
      .status(200)
      .json({ success: true, totalBooks: history.length, history });
  } catch (error) {
    next(new HttpError(error.message));
  }
};

export default { borrowBook, returnBook, borrowHistory };
