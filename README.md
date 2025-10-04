# 📚 BookNest - Book Review Platform

A full-stack MERN application for book enthusiasts to discover, review, and manage their favorite books. Built with modern web technologies and best practices.

![MERN Stack](https://img.shields.io/badge/MERN-Full%20Stack-green)
![JWT Authentication](https://img.shields.io/badge/Auth-JWT-blue)
![Responsive](https://img.shields.io/badge/Design-Responsive-purple)

## ✨ Features

### 🔐 Authentication System
- User registration with name, email, and password
- Secure login with JWT token-based authentication
- Password hashing using bcrypt
- Protected routes and middleware

### 📖 Book Management
- Add new books with title, author, description, genre, and published year
- Edit and delete books (creator only)
- View all books with pagination (5 books per page)
- Personal book collection management

### ⭐ Review System
- Add reviews with ratings (1-5 stars) and text comments
- Edit and delete your own reviews
- Average rating calculation for each book
- Comprehensive review display

### 🎨 User Experience
- Clean, responsive design
- Intuitive navigation
- Real-time updates
- Error handling and validation

## 🛠️ Tech Stack

### Frontend
- **React** - UI framework
- **React Router** - Navigation
- **Context API** - State management
- **Axios** - HTTP client
- **Tailwind CSS** - Styling

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcrypt** - Password hashing

## 📁 Project Structure

```
book-review-platform/
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   └── config/
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   ├── context/
    │   ├── services/
    │   └── utils/
```

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account
- Git

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd book-review-platform/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env` file in the backend directory:
   ```env
   PORT=6801
   MONGODB_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_jwt_secret_key
   ```

4. **Start the backend server**
   ```bash
   npm run dev
   ```
   Server will run on `http://localhost:6801`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd ../frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```


3. **Start the frontend development server**
   ```bash
   npm start
   ```
   Application will open on `http://localhost:5173`

## 📚 API Documentation

### Authentication Routes

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | User login | No |
| GET | `/api/auth/AuthorizeUser` | Verify user token | Yes |

### Book Routes

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/books/` | Get all books (paginated) | Yes |
| GET | `/api/books/mybooks` | Get user's books | Yes |
| GET | `/api/books/:id` | Get specific book details | No |
| POST | `/api/books/addbook` | Add new book | Yes |
| PUT | `/api/books/:id` | Update book | Yes (Owner only) |
| DELETE | `/api/books/:id` | Delete book | Yes (Owner only) |

### Review Routes

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/reviews/:bookId` | Add review to book | Yes |
| GET | `/api/reviews/:bookId` | Get reviews for a book | No |
| GET | `/api/reviews/` | Get all reviews | No |
| PUT | `/api/reviews/:id` | Update review | Yes (Owner only) |
| DELETE | `/api/reviews/:id` | Delete review | Yes (Owner only) |

## 🗄️ Database Schema

### User Schema
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed)
}
```

### Book Schema
```javascript
{
  title: String,
  author: String,
  description: String,
  genre: String,
  year: Number,
  addedBy: ObjectId (ref: User)
}
```

### Review Schema
```javascript
{
  bookId: ObjectId (ref: Book),
  userId: ObjectId (ref: User),
  rating: Number (1-5),
  reviewText: String
}
```

## 🎯 Usage Guide

1. **Registration & Login**
   - Create a new account or login with existing credentials
   - JWT token is automatically stored in localStorage

2. **Adding Books**
   - Navigate to "Add Book" page
   - Fill in book details and submit
   - Only you can edit or delete your added books

3. **Browsing Books**
   - View all books on the home page
   - Use pagination to navigate through books
   - Click on any book to see details and reviews

4. **Writing Reviews**
   - Go to any book details page
   - Add your rating and review text
   - Edit or delete your reviews anytime



**Built with ❤️ using the MERN Stack**

*Happy Reading! 📖✨*
