import mongoose from "mongoose";

const UserSchema = mongoose.Schema({
    Name: { type: String, required: true },
  Email: { type: String, required: true, unique: true },
  Password: { type: String, required: true, minlength: 6 ,select:false},
}, { timestamps: true })

const BookSchema = new mongoose.Schema({
  Title: { type: String, required: true, unique: true },
  Author: { type: String, required: true },
  Description: { type: String, required: true },
  Genre: { type: String, required: true },
  PublishedYear: { type: Number, required: true } ,
  Price: { type: Number, required: true } ,
  AddedBy: {type: mongoose.Schema.Types.ObjectId,ref: "user",required: true},
}, { timestamps: true });

const ReviewSchema = new mongoose.Schema({
    Rating: {type:Number,min:1,max:5,required:true},
    ReviewText:{type:String,required:true},
    BookID:{type: mongoose.Schema.Types.ObjectId,ref: "book",required: true},
    UserID:{type: mongoose.Schema.Types.ObjectId,ref: "user",required: true},
}, { timestamps: true })

export const User = mongoose.model("user",UserSchema)
export const Book = mongoose.model("book",BookSchema)
export const Review = mongoose.model("review",ReviewSchema)