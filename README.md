# 📚 Book Management App

A full-stack web application for managing books, including adding, editing, deleting, searching, and reviewing books. Built with **React**, **Tailwind CSS**, **Node.js**, **Express**, and **MongoDB**, with authentication and role-based features.

---

## 🔹 Project Structure

project-root
backend # Express.js server, MongoDB models, APIs
frontend # React app with Tailwind CSS, Context API for theme/auth
README.md

---

## 🔹 Features

- User authentication (register/login)
- Add, edit, delete books
- View and filter books by genre, year, rating
- Search books by title/author
- Review and rate books
- Light and Dark theme toggle
- Responsive design
- Loading spinner with random book quotes
- Pagination for books
- Optional: Add to cart functionality

---

## 🔹 Tech Stack

**Frontend:** React, Tailwind CSS, Lucide Icons, Context API  
**Backend:** Node.js, Express.js, MongoDB (via Mongoose), JWT  
**Tools:** Axios, Postman  

---

## 🔹 Setup Instructions

### 1️⃣ Clone the repository

2️⃣ Backend Setup

cd backend
npm install
Create a .env file in /backend:

PORT=6801
MONGO_URI=<your_mongodb_connection_string>
JWT_SECRET=<your_jwt_secret>

Start the backend server:


npm run dev
3️⃣ Frontend Setup

cd frontend
npm install
Create a .env.local in /frontend (if needed for API base URL):


VITE_API_BASE_URL=http://localhost:5173/
Start the frontend:


npm start
Open http://localhost:5173 in your browser.

🔹 API Documentation
Auth APIs
Endpoint	Method	Description

/auth/register	POST	Register a new user

/auth/login	POST	Login user and return JWT

Book APIs

Endpoint	Method	Description

/books	GET	Get all books

/books/:id	GET	Get single book

/books/addbook	POST	Add new book (protected)

/books/mybooks	GET	Get books added by logged-in user (protected)

/books/:id	PUT	Edit book (protected)

/books/:id	DELETE	Delete book (protected)

Review APIs

Endpoint	Method	Description

/review	GET	Get all reviews

/review/:id	GET	Get reviews of a specific book

/review/:id	POST	Add review for a book

/review/:id	PUT	Edit review

/review/:id	DELETE	Delete review


🔹 Environment Variables
Backend .env:


PORT=
MONGO_URI=
JWT_SECRET=

Frontend .env.local:

VITE_API_BASE_URL=
