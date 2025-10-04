import React, { useEffect, useState, useContext } from "react";
import { ReviewAPI } from "../../lib/api";
import { Theme } from "../../Context/ThemeContext/ThemeContext";
import { Trash2, Edit2 } from "lucide-react";
import RatingChart from "../Charts/RatingChart";

const ReviewComponent = ({ Bookid }) => {
  const [Reviews, setReviews] = useState([]);
  const [addingReview, setAddingReview] = useState(false);
  const [newReview, setNewReview] = useState({ Rating: 1, ReviewText: "" });
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [editingReview, setEditingReview] = useState({
    Rating: 1,
    ReviewText: "",
  });

  const { SwitchTheme } = useContext(Theme);
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  const GetReviewoftheBook = async () => {
    if (!Bookid) return;
    try {
      const res = await ReviewAPI.GetReviewofBook(Bookid);
      const sorted = (res.data || []).sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      ); // Latest first
      setReviews(sorted);
    } catch (error) {
      if (error.response?.status === 404) setReviews([]);
      else console.error("Error fetching reviews:", error);
    }
  };

  useEffect(() => {
    GetReviewoftheBook();
  }, [Bookid]);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleString("en-US", { month: "short", year: "numeric" });
  };

  const handleAddReview = async () => {
    if (!newReview.ReviewText) return alert("Review text is required!");
    try {
      await ReviewAPI.AddReview({ ...newReview }, Bookid);
      setNewReview({ Rating: 1, ReviewText: "" });
      setAddingReview(false);
      GetReviewoftheBook();
    } catch (error) {
      console.error("Error adding review:", error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;
    try {
      await ReviewAPI.DeleteReview(id);
      GetReviewoftheBook();
    } catch (error) {
      console.error("Error deleting review:", error);
    }
  };

  const startEditingReview = (review) => {
    setEditingReviewId(review._id);
    setEditingReview({ Rating: review.Rating, ReviewText: review.ReviewText });
  };

  const handleUpdateReview = async (id) => {
    if (!editingReview.ReviewText) return alert("Review text is required!");
    try {
      await ReviewAPI.EditReview(editingReview, id);
      setEditingReviewId(null);
      setEditingReview({ Rating: 1, ReviewText: "" });
      GetReviewoftheBook();
    } catch (error) {
      console.error("Error updating review:", error);
    }
  };

  return (
    <div
      className={`min-h-screen p-6 transition-colors duration-300 ${
        SwitchTheme === "dark" ? "bg-gray-900" : "bg-gray-50"
      }`}
    >
      <div
        className={`max-w-4xl mx-auto p-6 rounded-xl shadow-md transition-colors ${
          SwitchTheme === "dark"
            ? "bg-gray-800 text-gray-100"
            : "bg-white text-gray-900"
        }`}
      >
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Reviews ({Reviews.length})</h1>
          <button
            onClick={() => setAddingReview(!addingReview)}
            className="px-4 py-1.5 rounded-md bg-indigo-500 text-white text-sm font-medium hover:bg-indigo-600 transition-colors"
          >
            {addingReview ? "Cancel" : "Add Review"}
          </button>
        </div>

       

        {/* Add Review Form */}
        {addingReview && (
          <div
            className={`p-4 mb-4 rounded-lg border transition-colors ${
              SwitchTheme === "dark"
                ? "border-gray-600 bg-gray-700"
                : "border-gray-200 bg-gray-100"
            }`}
          >
            <div className="flex items-center gap-4 mb-3">
              <label>Rating:</label>
              <select
                value={newReview.Rating}
                onChange={(e) =>
                  setNewReview({ ...newReview, Rating: parseInt(e.target.value) })
                }
                className="px-2 py-1 rounded border"
              >
                {[1, 2, 3, 4, 5].map((num) => (
                  <option key={num} value={num} className={`${SwitchTheme === "dark" ? "text-white bg-gray-700":"text-black"}`}>
                    {num}
                  </option>
                ))}
              </select>
            </div>
            <textarea
              value={newReview.ReviewText}
              onChange={(e) =>
                setNewReview({ ...newReview, ReviewText: e.target.value })
              }
              placeholder="Write your review..."
              className="w-full px-3 py-2 rounded-md border resize-none"
            />
            <button
              onClick={handleAddReview}
              className="mt-3 px-4 py-1.5 rounded-md bg-green-500 text-white hover:bg-green-600 transition-colors"
            >
              Submit
            </button>
          </div>
        )}

        {/* Reviews Section */}
        {Reviews.length > 0 ? (
          Reviews.map((review) => {
            const isUserReview =
              currentUser &&
              review?.UserID?.Email?.toLowerCase() ===
                currentUser.Email?.toLowerCase();

            return (
              <div
                key={review._id}
                className={`p-4 rounded-xl mb-3 shadow-sm transition-colors ${
                  SwitchTheme === "dark"
                    ? "bg-gray-700 text-gray-100"
                    : "bg-gray-50 text-gray-900"
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="bg-yellow-400 w-10 h-10 flex items-center justify-center rounded-full font-bold text-black">
                      {review?.UserID?.Name
                        ? review.UserID.Name[0].toUpperCase()
                        : "U"}
                    </div>
                    <div>
                      <h2 className="font-semibold">
                        {review?.UserID?.Name || "Unknown User"}
                      </h2>
                      <span className="text-sm text-gray-500">
                        {review?.createdAt ? formatDate(review.createdAt) : ""}
                      </span>
                    </div>
                  </div>

                  {isUserReview && (
                    <div className="flex gap-2">
                      <button onClick={() => startEditingReview(review)}>
                        <Edit2
                          className={`w-5 h-5 ${
                            SwitchTheme === "dark"
                              ? "text-blue-400"
                              : "text-blue-600"
                          }`}
                        />
                      </button>
                      <button onClick={() => handleDelete(review._id)}>
                        <Trash2
                          className={`w-5 h-5 ${
                            SwitchTheme === "dark"
                              ? "text-red-400"
                              : "text-red-600"
                          }`}
                        />
                      </button>
                    </div>
                  )}
                </div>

                {editingReviewId === review._id ? (
                  <div className="mt-2">
                    <div className="flex items-center gap-2 mb-2">
                      <label>Rating:</label>
                      <select
                        value={editingReview.Rating}
                        onChange={(e) =>
                          setEditingReview({
                            ...editingReview,
                            Rating: parseInt(e.target.value),
                          })
                        }
                        className="px-2 py-1 rounded border "
                      >
                        {[1, 2, 3, 4, 5,].map((num) => (
                          <option key={num} value={num} >
                            {num}
                          </option>
                        ))}
                      </select>
                    </div>
                    <textarea
                      value={editingReview.ReviewText}
                      onChange={(e) =>
                        setEditingReview({
                          ...editingReview,
                          ReviewText: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 rounded-md border resize-none mb-2"
                    />
                    <button
                      onClick={() => handleUpdateReview(review._id)}
                      className="px-4 py-1.5 rounded-md bg-blue-500 text-white hover:bg-blue-600 mr-2"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => setEditingReviewId(null)}
                      className="px-4 py-1.5 rounded-md bg-gray-400 text-white hover:bg-gray-500"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <>
                    <p className="mt-2">{review.ReviewText}</p>
                    {review?.Rating && (
                      <div className="mt-2 text-yellow-500">
                        {"⭐".repeat(review.Rating)}
                      </div>
                    )}
                  </>
                )}
              </div>
            );
          })
        ) : (
          <div
            className={`${
              SwitchTheme === "dark" ? "text-gray-400" : "text-gray-500"
            }`}
          >
            No reviews yet.
          </div>
        )}
       <RatingChart reviews={Reviews} />
      </div>
    </div>
  );
};

export default ReviewComponent;
