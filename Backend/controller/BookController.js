import { Book } from "../model/model.js";

export async function AddBook(req, res) {
  const { Title, Author, Description, Genre, PublishedYear,Price } = req.body;
  try {
    if (!Title || !Author || !Description || !Genre || !PublishedYear) {
      return res.status(400).json("Please fill all fields");
    }

    const NewBook = new Book({
      Title,
      Author,
      Description,
      Genre,
      PublishedYear,
      Price,
      AddedBy: req.user._id,
    });
    NewBook.save();
    return res.status(201).json("Added Book Successfully");
  } catch (error) {
    return res.status(400).json("Failed in Adding a Book");
  }
}

export async function Books(req, res) {
  try {
    const allBooks = await Book.find({});

    if (allBooks.length === 0) {
      return res.status(404).json({ message: "No Books Found" });
    }

    return res.status(200).json({ books: allBooks });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server Error" });
  }
}

export async function GetBook(req,res) {
  const {id} = req.params;
  try {
    const Getbook = await Book.findById(id)
    if(!Getbook) {
      return res.status(404).json({Message:"No Book Found"})
    }
    return res.status(200).json({SingleBook:Getbook})
  } catch (error) {
    return res.status(400).json({message:error})
  }
}

export async function EditBook(req, res) {
  try {
    const { Title, Author, Description, Genre, PublishedYear } = req.body;
    const { id } = req.params;

    // 1. Find the book
    const book = await Book.findById(id);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    // 2. Check who is owner
    if (book.AddedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You cannot edit this book" });
    }

    // 3. Update book
    book.Title = Title || book.Title;
    book.Author = Author || book.Author;
    book.Description = Description || book.Description;
    book.Genre = Genre || book.Genre;
    book.PublishedYear = PublishedYear || book.PublishedYear;

    const updatedBook = await book.save();

    return res.status(200).json(updatedBook);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
}

export async function GetMyBooks(req, res) {
  try {
    // <-- check if undefined
    const books = await Book.find({ AddedBy: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(books);
  } catch (error) {
    console.error(error);
    res.status(400).json("Failed to fetch books");
  }
}


export async function DeleteBook(req, res) {
  try {
    const { id } = req.params;
    const deleteBook = await Book.findById(id);
    if (!deleteBook) {
      return res.status(404).json({ Error: "Book not found" });
    }
    if (deleteBook.AddedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You cannot delete this book" });
    }
    await deleteBook.deleteOne();
    return res.status(200).json({ message: "Book deleted successfully" });
  } catch (error) {
    return res.status(400).json({ Error: error });
  }
}
