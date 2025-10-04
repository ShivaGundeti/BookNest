import React from 'react'
import Register from './Pages/Auth/Register'
import Login from './Pages/Auth/Login'
import { BrowserRouter, Route, Routes } from 'react-router'
import ProtectedRoute from './Pages/ProtectedRoute/ProtectedRoute'
import Dashboard from './Pages//'
import { ThemeProvider } from './Context/ThemeContext/Theme'
import BookDetailPage from './Pages/BookDetail/BookDetailPage'
import AddBook from './Pages/AddBook/AddBook'

const App = () => {
  return (
   
       <ThemeProvider>
    <BrowserRouter>
   <Routes>
    <Route path="/auth/login" element={<Login />} />
    <Route path="/auth/register" element={<Register />} />
    <Route path="/" element={
      <ProtectedRoute>
        <Dashboard/>
      </ProtectedRoute>
    } />
<Route path="/BookDetails/:id" element={
      <ProtectedRoute>
        <BookDetailPage/>
      </ProtectedRoute>
    } />
    <Route path="/Mybooks" element={
      <ProtectedRoute>
        <AddBook/>
      </ProtectedRoute>
    } />
   </Routes>
    </BrowserRouter>
    </ThemeProvider>
  )
}

export default App