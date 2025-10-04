import express from "express"
import { AddReview, DeleteReview, EditReview, GetReviewofBook,GetReviews } from "../controller/ReviewController.js"
import { protect } from "../middleware/middleware.js"

const router = express.Router()

router.post("/:bookId",protect,AddReview)
router.get("/:bookId", GetReviewofBook);
router.get("/", GetReviews);
router.put("/:id", protect, EditReview);
router.delete("/:id", protect, DeleteReview);

export default router