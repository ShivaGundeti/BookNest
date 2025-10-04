import React, { useEffect, useState, useContext } from "react";
import { BookAPI, ReviewAPI } from "../../lib/api";
import { ArrowUpDown, Funnel, Star } from "lucide-react";
import { Theme } from "../../Context/ThemeContext/ThemeContext";
import { useNavigate } from "react-router";
import LoadingPage from "../Loading/Loadingpage";

const BookList = () => {
  const [Books, setBooks] = useState([]);
  const [Reviews, setReviews] = useState([]);
  const [Genres, setGenres] = useState(["All"]);
  const [SearchBook, setSearchBook] = useState("");
  const [SelectGenre, setSelectGenre] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [publishedYears, setPublishedYears] = useState(["All"]);
  const [selectYear, setSelectYear] = useState("All");
  const [sortRating, setSortRating] = useState("All");
  const [showResetbtn, setShowResetbtn] = useState(false);
  const [loading, setLoading] = useState(true);

  const itemperpage = 4;
  const { SwitchTheme } = useContext(Theme);
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      setLoading(true);
      const bookResponse = await BookAPI.GetBooks();
      const reviewResponse = await ReviewAPI.Reviews();
      if (bookResponse.status === 200) setBooks(bookResponse.data.books);
      if (reviewResponse.status === 200) setReviews(reviewResponse.data.Review);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const averageRating = (bookid) => {
    const bookReviews = Reviews.filter((r) => r.BookID === bookid);
    if (bookReviews.length === 0) return 0;
    const total = bookReviews.reduce((sum, r) => sum + r.Rating, 0);
    return total / bookReviews.length;
  };

  const StarRatings = (rating) => {
    if (!rating || rating <= 0) return "No Ratings";
    let stars = "";
    const fullStars = Math.floor(rating);
    const hasHalf = rating % 1 !== 0;
    for (let i = 0; i < fullStars; i++) stars += "⭐";
    if (hasHalf) stars += "🌟";
    return stars;
  };

  let FilterBooks = Books.filter((book) => {
    const TitleOrAuthor =
      book.Title.toLowerCase().includes(SearchBook.toLowerCase()) ||
      book.Author.toLowerCase().includes(SearchBook.toLowerCase());
    const FilterByGenre = SelectGenre === "All" || book.Genre === SelectGenre;
    const FilterByYear = selectYear === "All" || book.PublishedYear === +selectYear;
    return TitleOrAuthor && FilterByGenre && FilterByYear;
  });

  if (sortRating !== "All") {
    FilterBooks = [...FilterBooks].sort((a, b) => {
      const ratingA = averageRating(a._id);
      const ratingB = averageRating(b._id);
      return sortRating === "high" ? ratingB - ratingA : ratingA - ratingB;
    });
  }

  const totalPages = Math.ceil(FilterBooks.length / itemperpage);
  const BookPagination = FilterBooks.slice(
    (currentPage - 1) * itemperpage,
    currentPage * itemperpage
  );

  useEffect(() => {
    if (Books.length > 0) {
      setGenres(["All", ...new Set(Books.map((b) => b.Genre))]);
      setPublishedYears(["All", ...new Set(Books.map((b) => b.PublishedYear))]);
    }
  }, [Books]);

  useEffect(() => {
    if (
      SearchBook !== "" ||
      SelectGenre !== "All" ||
      selectYear !== "All" ||
      sortRating !== "All"
    ) {
      setShowResetbtn(true);
    } else {
      setShowResetbtn(false);
    }
  }, [SearchBook, SelectGenre, selectYear, sortRating]);

  const handleReset = () => {
    setSearchBook("");
    setSelectGenre("All");
    setSelectYear("All");
    setSortRating("All");
    setCurrentPage(1);
  };

  if (loading) return <LoadingPage />;

  return (
    <div
      className={`p-4 mt-6 w-full transition-colors duration-300 ${
        SwitchTheme === "dark"
          ? "bg-gray-900 text-gray-100"
          : "bg-gray-50 text-gray-900"
      }`}
    >
      <div className="flex flex-col gap-4 mb-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-2 w-full lg:w-1/2">
          <label className="font-medium text-base whitespace-nowrap">
            Search:
          </label>
          <input
            type="text"
            onChange={(e) => setSearchBook(e.target.value)}
            value={SearchBook}
            className={`flex-1 rounded-md px-3 py-1.5 text-sm border focus:ring-2 focus:ring-indigo-500 outline-none shadow-sm max-w-sm transition-colors duration-300
              ${
                SwitchTheme === "dark"
                  ? "bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-400"
                  : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
              }`}
            placeholder="Search by Title/Author"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium flex items-center gap-1">
              Genre <Funnel size={16} />
            </label>
            <div className="relative w-32">
              <select
                onChange={(e) => setSelectGenre(e.target.value)}
                value={SelectGenre}
                className={`appearance-none w-full rounded-md py-1.5 pl-3 pr-8 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer transition-colors duration-300
                  ${
                    SwitchTheme === "dark"
                      ? "bg-gray-800 border border-gray-700 text-gray-100"
                      : "bg-white border border-gray-300 text-gray-900"
                  }`}
              >
                {Genres.sort().map((item, idx) => (
                  <option key={idx} value={item}>
                    {item}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none text-gray-400">
                ▼
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm font-medium flex items-center gap-1">
              Year <ArrowUpDown size={16} />
            </label>
            <div className="relative w-28">
              <select
                onChange={(e) => setSelectYear(e.target.value)}
                value={selectYear}
                className={`appearance-none w-full rounded-md py-1.5 pl-3 pr-8 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer transition-colors duration-300
                  ${
                    SwitchTheme === "dark"
                      ? "bg-gray-800 border border-gray-700 text-gray-100"
                      : "bg-white border border-gray-300 text-gray-900"
                  }`}
              >
                {publishedYears.map((item, idx) => (
                  <option key={idx} value={item}>
                    {item}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none text-gray-400">
                ▼
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm font-medium flex items-center gap-1">
              Rating <Star size={16} />
            </label>
            <div className="relative w-36">
              <select
                onChange={(e) => setSortRating(e.target.value)}
                value={sortRating}
                className={`appearance-none w-full rounded-md py-1.5 pl-3 pr-8 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer transition-colors duration-300
                  ${
                    SwitchTheme === "dark"
                      ? "bg-gray-800 border border-gray-700 text-gray-100"
                      : "bg-white border border-gray-300 text-gray-900"
                  }`}
              >
                <option value="All">All</option>
                <option value="high">High → Low</option>
                <option value="low">Low → High</option>
              </select>
              <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none text-gray-400">
                ▼
              </div>
            </div>
          </div>

          {showResetbtn && (
            <button
              onClick={handleReset}
              className={`px-4 py-1.5 rounded-md font-medium shadow-sm transition-all duration-300
                ${
                  SwitchTheme === "dark"
                    ? "bg-red-600 text-white hover:bg-red-700"
                    : "bg-red-500 text-white hover:bg-red-600"
                }`}
            >
              Reset
            </button>
          )}
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 auto-rows-fr">
        {BookPagination.length > 0 ? (
          BookPagination.map((item, idx) => {
            const rating = averageRating(item._id);
            return (
              <div
                key={idx}
                className={`rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col
                  ${SwitchTheme === "dark" ? "bg-gray-800 text-gray-100" : "bg-white text-gray-900"}`}
                onClick={() => navigate(`/BookDetails/${item._id}`)}
              >
                <div className="relative w-full aspect-[5/3] bg-cover bg-center">
                  <div
                    className="absolute inset-0 bg-black/40 flex items-center justify-center"
                    style={{
                      backgroundImage: `url('https://images.unsplash.com/photo-1560697529-7236591c0066?q=80&w=1170&auto=format&fit=crop')`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  >
                    <h1 className="text-lg md:text-xl text-white font-bold text-center px-2">
                      {item.Title}
                    </h1>
                  </div>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div className="flex flex-col gap-2">
                    <h2 className="text-base font-semibold line-clamp-2">{item.Title}</h2>
                    <div className="flex items-center gap-1 text-yellow-500 text-sm">
                      <span>
                        {rating > 0
                          ? `${StarRatings(rating)} (${rating.toFixed(1)})`
                          : "No Ratings"}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-indigo-500">Rs.{item.Price}/-</h3>
                  </div>

                  <button
                    className="w-full mt-3 py-2 rounded-md bg-gradient-to-r from-indigo-500 to-blue-600 
                      text-white text-sm font-medium shadow hover:from-blue-600 hover:to-indigo-500 
                      transform hover:scale-105 transition-all duration-300"
                  >
                    🛒 Add to Cart
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <h2 className="col-span-full text-center text-gray-500">
            No books available...
          </h2>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-6 text-sm">
          <button
            className={`px-3 py-1 rounded-md hover:bg-gray-300 disabled:opacity-50 transition-colors duration-300
              ${
                SwitchTheme === "dark"
                  ? "bg-gray-700 text-gray-200 hover:bg-gray-600"
                  : "bg-gray-200 text-gray-900 hover:bg-gray-300"
              }`}
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
          >
            Previous
          </button>
          <span className="font-medium">
            {currentPage}/{totalPages}
          </span>
          <button
            className={`px-3 py-1 rounded-md hover:bg-gray-300 disabled:opacity-50 transition-colors duration-300
              ${
                SwitchTheme === "dark"
                  ? "bg-gray-700 text-gray-200 hover:bg-gray-600"
                  : "bg-gray-200 text-gray-900 hover:bg-gray-300"
              }`}
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default BookList;
