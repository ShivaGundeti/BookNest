import express from "express"
import {AuthorizeUser, login,register} from "../controller/AuthController.js"
import { protect } from "../middleware/middleware.js"
const router = express.Router()

router.post('/login',login)
router.post('/register',register)
router.get('/AuthorizeUser',protect,AuthorizeUser)

export default router