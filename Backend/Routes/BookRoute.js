import express from 'express'
import { AddBook, Books, DeleteBook, EditBook,GetBook ,GetMyBooks} from '../controller/BookController.js';
import { protect } from '../middleware/middleware.js';

const router = express.Router();

router.get('/',protect,Books)
router.get("/mybooks", protect, GetMyBooks);
router.get('/:id',GetBook)
router.post('/addbook',protect,AddBook)
router.put('/:id',protect,EditBook)
router.delete('/:id',protect,DeleteBook)

export default router