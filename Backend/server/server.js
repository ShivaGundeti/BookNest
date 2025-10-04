import express from "express"
import auth from "../Routes/AuthRoute.js"
import Book from "../Routes/BookRoute.js"
import Review from "../Routes/ReviewRoute.js"
import dotenv from "dotenv"
import cors from "cors"
import { ConnectMongodb } from "../lib/mongo/db.js"
const app = express()
dotenv.config()
app.use(cors())
app.use(express.json())
app.use("/auth",auth)
app.use("/books",Book)
app.use("/review",Review)
ConnectMongodb().then(()=>{
app.listen(process.env.PORT,()=>{
    console.log("server started✅✅");
})
})
