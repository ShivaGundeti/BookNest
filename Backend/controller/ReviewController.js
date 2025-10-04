import { Book, Review } from "../model/model.js";

export async function AddReview(req, res) {
  try {
    const { Rating, ReviewText } = req.body;
    const {bookId} = req.params;
    
    if (!Rating || !ReviewText || !bookId) {
      return res.status(401).json({ message: "All Fields are required" });
    }
    const NewReview = new Review({
      Rating,
      ReviewText,
      UserID: req.user._id,
      BookID:bookId,
    });

    NewReview.save();
    return res.status(200).json({message:"Review added successfully"})
  } catch (error) {
    return res.status(404).json({ message: error });
  }
}

export async function GetReviews(req,res) {
  try {
    const reviews = await Review.find({})
    return res.status(200).json({Review:reviews})
  } catch (error) {
    return res.status(404).json({message:error})
  }
}


export async function GetReviewofBook(req, res) {
  try {
    const { bookId } = req.params; 
    const reviews = await Review.find({ BookID: bookId }).populate("UserID", "Name Email");

    if (reviews.length === 0) {
      return res.status(404).json({ message: "No reviews found for this book" });
    }

    return res.status(200).json(reviews);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
}

export async function EditReview(req, res) {
  try {
    const { id } = req.params; // review id
    const { Rating, ReviewText } = req.body;

    const updatedReview = await Review.findOneAndUpdate(
      { _id: id, UserID: req.user._id }, // user can edit only their review
      { Rating, ReviewText },
      { new: true, runValidators: true }
    );

    if (!updatedReview) {
      return res.status(404).json({ message: "Review not found or not authorized" });
    }

    return res.status(200).json(updatedReview);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
}
export async function DeleteReview(req, res) {
  try {
    const { id } = req.params; // review id

    const deletedReview = await Review.findOneAndDelete({
      _id: id,
      UserID: req.user._id, // only the owner can delete
    });

    if (!deletedReview) {
      return res.status(404).json({ message: "Review not found or not authorized" });
    }

    return res.status(200).json({ message: "Review deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
}
