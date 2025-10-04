import React, { useState, useEffect, useContext } from "react";
import Navbar from "../../Components/Navbar/Navbar";
import { Pencil, Trash, X } from "lucide-react";
import { BookAPI } from "../../lib/api";
import { Theme } from "../../Context/ThemeContext/ThemeContext";
import LoadingPage from "../Loading/Loadingpage";

const genres = [
  "Fiction",
  "Non-Fiction",
  "Science",
  "Biography",
  "History",
  "Fantasy",
  "Mystery",
  "Romance",
];

const AddBook = () => {
  const { SwitchTheme } = useContext(Theme);

  const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
  
  const [formData, setFormData] = useState({
    Title: "",
    Author: "",
    Description: "",
    Genre: "",
    PublishedYear: "",
    Price: "",
  });
  const [editBook, setEditBook] = useState(null);
//   const [loading, setLoading] = useState(false);

  const isDark = SwitchTheme === "dark";

  // Fetch books
  const fetchBooks = async () => {
    try {
        setLoading(true)
      const res = await BookAPI.GetMyBooks();
      setBooks(res.data);
    } catch (err) {
      console.error(err);
    }finally{
        setLoading(false)
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (editBook) {
        await BookAPI.EditBook(editBook._id, formData);
        alert("Book updated successfully!");
        setEditBook(null);
      } else {
        await BookAPI.AddBook(formData);
        alert("Book added successfully!");
      }
      setFormData({
        Title: "",
        Author: "",
        Description: "",
        Genre: "",
        PublishedYear: "",
        Price: "",
      });
      fetchBooks();
    } catch (err) {
      console.error(err);
      alert("Failed to save book.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (book) => {
    setEditBook(book);
    setFormData({
      Title: book.Title,
      Author: book.Author,
      Description: book.Description,
      Genre: book.Genre,
      PublishedYear: book.PublishedYear,
      Price: book.Price,
    });
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  };

  const cancelEdit = () => {
    setEditBook(null);
    setFormData({
      Title: "",
      Author: "",
      Description: "",
      Genre: "",
      PublishedYear: "",
      Price: "",
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this book?")) {
      try {
        await BookAPI.DeleteBook(id);
        fetchBooks();
      } catch (err) {
        console.error(err);
        alert("Failed to delete book.");
      }
    }
  };
if(loading) return <LoadingPage/>
  return (
    <>
      <Navbar />
      <div
        className={`max-w-7xl mx-auto px-4 py-8 ${
          isDark ? "bg-gray-900 text-gray-200" : "bg-gray-50 text-gray-900"
        } min-h-screen`}
      >
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h2 className="text-2xl md:text-3xl font-semibold flex items-center gap-2">
            📚 My Books
          </h2>
          <button
            onClick={() =>
              document.getElementById("addBookSection").scrollIntoView({ behavior: "smooth" })
            }
            className={`px-4 py-2 rounded-md transition ${
              isDark
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            + Add Book
          </button>
        </div>

        {/* Books List */}
        {books.length === 0 ? (
          <div
            className={`text-center border p-10 rounded-md shadow-sm ${
              isDark ? "border-gray-700 text-gray-300" : "border-gray-200 text-gray-700"
            }`}
          >
            📖 No books added yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {books.map((book) => (
              <div
                key={book._id}
                className={`border rounded-lg shadow-md hover:shadow-lg transition overflow-hidden ${
                  isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
                }`}
              >
                <div
                  className="h-48 bg-cover bg-center relative"
                  style={{
                    backgroundImage:
                      "url('https://images.unsplash.com/photo-1560697529-7236591c0066?q=80&w=1170&auto=format&fit=crop')",
                  }}
                >
                  <div className="absolute top-2 right-2 flex gap-2">
                    <button
                      onClick={() => handleEdit(book)}
                      className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full transition"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(book._id)}
                      className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full transition"
                    >
                      <Trash size={16} />
                    </button>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className={`${isDark ? "text-gray-100" : "text-gray-900"} font-semibold text-lg`}>
                    {book.Title}
                  </h3>
                  <p className={`${isDark ? "text-gray-400" : "text-gray-500"} text-sm`}>
                    by {book.Author}
                  </p>
                  <p className={`${isDark ? "text-gray-300" : "text-gray-600"} text-sm mt-1`}>
                    {book.Genre}
                  </p>
                  <p className="text-blue-500 font-semibold mt-2">₹{book.Price}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add / Edit Form */}
        <div
          id="addBookSection"
          className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-10 items-center"
        >
          {/* Left: Preview */}
          <div className="flex justify-center">
            <div
              className="w-80 h-96 rounded-lg flex items-center justify-center text-white text-2xl font-bold"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1560697529-7236591c0066?q=80&w=1170&auto=format&fit=crop')",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              {formData.Title || "Book Cover"}
            </div>
          </div>

          {/* Right: Form */}
          <form
            onSubmit={handleSubmit}
            className={`border rounded-lg shadow-md p-6 space-y-4 ${
              isDark ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"
            }`}
          >
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold">
                {editBook ? "Edit Book" : "Add a New Book"}
              </h3>
              {editBook && (
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="text-red-500 flex items-center gap-1 text-sm"
                >
                  <X size={14} /> Cancel
                </button>
              )}
            </div>

            {/* Title & Author */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input
                  type="text"
                  name="Title"
                  value={formData.Title}
                  onChange={handleChange}
                  className={`w-full border rounded-md p-2 outline-none focus:ring-2 focus:ring-blue-400 ${
                    isDark ? "bg-gray-800 text-gray-100 border-gray-700" : "bg-white text-gray-900 border-gray-300"
                  }`}
                  placeholder="Enter Title"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Author</label>
                <input
                  type="text"
                  name="Author"
                  value={formData.Author}
                  onChange={handleChange}
                  className={`w-full border rounded-md p-2 outline-none focus:ring-2 focus:ring-blue-400 ${
                    isDark ? "bg-gray-800 text-gray-100 border-gray-700" : "bg-white text-gray-900 border-gray-300"
                  }`}
                  placeholder="Enter Author"
                  required
                />
              </div>
            </div>

            {/* Genre Dropdown */}
            <div>
              <label className="block text-sm font-medium mb-1">Genre</label>
              <select
                name="Genre"
                value={formData.Genre}
                onChange={handleChange}
                className={`w-full border rounded-md p-2 outline-none focus:ring-2 focus:ring-blue-400 ${
                  isDark ? "bg-gray-800 text-gray-100 border-gray-700" : "bg-white text-gray-900 border-gray-300"
                }`}
                required
              >
                <option value="" disabled>Select Genre</option>
                {genres.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                name="Description"
                value={formData.Description}
                onChange={handleChange}
                rows="3"
                className={`w-full border rounded-md p-2 outline-none focus:ring-2 focus:ring-blue-400 ${
                  isDark ? "bg-gray-800 text-gray-100 border-gray-700" : "bg-white text-gray-900 border-gray-300"
                }`}
                placeholder="Enter Description"
                required
              />
            </div>

            {/* PublishedYear & Price */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Published Year</label>
                <input
                  type="number"
                  name="PublishedYear"
                  value={formData.PublishedYear}
                  onChange={handleChange}
                  className={`w-full border rounded-md p-2 outline-none focus:ring-2 focus:ring-blue-400 ${
                    isDark ? "bg-gray-800 text-gray-100 border-gray-700" : "bg-white text-gray-900 border-gray-300"
                  }`}
                  placeholder="Enter Year"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Price</label>
                <input
                  type="number"
                  name="Price"
                  value={formData.Price}
                  onChange={handleChange}
                  className={`w-full border rounded-md p-2 outline-none focus:ring-2 focus:ring-blue-400 ${
                    isDark ? "bg-gray-800 text-gray-100 border-gray-700" : "bg-white text-gray-900 border-gray-300"
                  }`}
                  placeholder="Enter Price"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 rounded-md transition disabled:opacity-50 ${
                isDark ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              {loading ? (editBook ? "Updating..." : "Adding...") : editBook ? "Update Book" : "Add Book"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddBook;
