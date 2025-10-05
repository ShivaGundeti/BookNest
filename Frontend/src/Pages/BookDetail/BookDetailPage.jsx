import React, { useEffect, useState, useContext } from "react";
import Navbar from "../../Components/Navbar/Navbar";
import { useParams } from "react-router";
import { BookAPI, ReviewAPI } from "../../lib/api";
import { Theme } from "../../Context/ThemeContext/ThemeContext";
import ReviewComponent from "../../Components/BookDetails/ReviewComponent";
import LoadingPage from "../Loading/Loadingpage";

const BookDetailPage = () => {
  const [BookDetails, setBookDetails] = useState({});
  const [Reviews, setReviews] = useState([]);
  const { SwitchTheme } = useContext(Theme);
  const { id } = useParams();
  const [loading, setLoading] = useState(true);

  const GetaBook = async () => {
    try {
      setLoading(true);
      const res = await BookAPI.GetBook(id);
      setBookDetails(res.data.SingleBook);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const GetReviews = async () => {
    try {
      setLoading(true);
      const res = await ReviewAPI.Reviews();
      if (res.status === 200) {
        setReviews(res.data.Review.filter((r) => r.BookID === id));
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    GetaBook();
    GetReviews();
  }, [id]);

  const averageRating = () => {
    if (Reviews.length === 0) return 0;
    const total = Reviews.reduce((acc, review) => acc + review.Rating, 0);
    return total / Reviews.length;
  };

  const StarRatings = (rating) => {
    let stars = "";
    if (Number.isInteger(rating)) {
      for (let i = 0; i < rating; i++) stars += "⭐";
    } else {
      let original = Math.floor(rating);
      for (let i = 0; i < original; i++) stars += "⭐";
      stars += "🌟";
    }
    return stars;
  };

  if (loading) return <LoadingPage />;

  return (
    <>
      <Navbar />
      <div
        className={`${
          SwitchTheme === "dark"
            ? "bg-gray-900 text-gray-100"
            : "bg-gray-50 text-gray-900"
        } min-h-screen py-10 px-4 sm:px-6 lg:px-12`}
      >
        <div className="flex flex-col lg:flex-row justify-center items-center gap-10">
          <div className="w-full sm:w-3/4 md:w-2/3 lg:w-[420px] xl:w-[480px]">
            <div className="relative w-full h-80 sm:h-96 lg:h-[500px] rounded-xl shadow-lg overflow-hidden">
              <div
                className="w-full h-full bg-cover bg-center"
                style={{
                  backgroundImage: `url('${
                    BookDetails?.Image ||
                    "https://images.unsplash.com/photo-1560697529-7236591c0066?q=80&w=1170&auto=format&fit=crop"
                  }')`,
                }}
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center p-4">
                <h1 className="text-center text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold drop-shadow-lg">
                  {BookDetails?.Title}
                </h1>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-5 text-center lg:text-left w-full sm:w-3/4 md:w-2/3 lg:w-[500px]">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
              {BookDetails?.Title}
            </h1>
            <h2 className="text-lg sm:text-xl lg:text-2xl font-medium text-gray-600 dark:text-gray-300">
              by {BookDetails?.Author}
            </h2>

            <div className="flex flex-col sm:flex-row justify-center lg:justify-start items-center gap-2 text-yellow-500">
              <span>
                {Reviews.length > 0
                  ? StarRatings(averageRating())
                  : "No Ratings"}
              </span>
              {Reviews.length > 0 && (
                <span className="text-gray-500 dark:text-gray-400">
                  ({Reviews.length} reviews)
                </span>
              )}
            </div>

            <h3 className="text-2xl sm:text-3xl font-bold text-indigo-600">
              Rs.{BookDetails?.Price}/-
            </h3>

            <p className="leading-relaxed text-base sm:text-lg">
              {BookDetails?.Description || "No description available."}
            </p>

            <button className="mt-4 w-full sm:w-44 py-3 rounded-md bg-gradient-to-r from-indigo-500 to-blue-600 text-white font-medium shadow hover:from-blue-600 hover:to-indigo-500 transition-transform transform hover:scale-105">
              🛒 Add to Cart
            </button>
          </div>
        </div>
      </div>
      <ReviewComponent Bookid={id} />
    </>
  );
};

export default BookDetailPage;
