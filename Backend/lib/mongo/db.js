import mongoose from "mongoose";
import dotenv from "dotenv"
dotenv.config()
export const ConnectMongodb = async () =>{
    try {
        mongoose.connect(process.env.MONGO_URL)
        console.log('MongoDB Connected 👨🏻‍💻');
    } catch (error) {
        console.log(error);
    }
}