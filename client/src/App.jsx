import { Route, Routes } from "react-router-dom"
import Home from "./pages/Home"
import Layout from "./pages/Layout"
import WriteArticle from "./pages/WriteArticle"
import BlogTitles from "./pages/BlogTitles"
import Dashboard from "./pages/Dashboard"
import GenerateImages from "./pages/GenerateImages"
import RemoveBackground from "./pages/RemoveBackground"
import RemoveObject from "./pages/RemoveObject"
import ReviewResume from "./pages/ReviewResume"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import AppLayout from "./components/AppLayout"
import ProtectedRoute from "./components/ProtectedRoute"
import {Toaster} from "react-hot-toast" ;

export default function App() {
  return <div>
    <Toaster />
    <Routes>
    
      <Route path="/" element={<AppLayout />}>
        <Route index element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/ai" element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }>
          <Route index element={<Dashboard />} />
          <Route path="write-article" element={<WriteArticle />} />
          <Route path="blog-titles" element={<BlogTitles />} />
          <Route path="generate-images" element={<GenerateImages />} />
          <Route path="remove-background" element={<RemoveBackground />} />
          <Route path="remove-object" element={<RemoveObject />} />
          <Route path="review-resume" element={<ReviewResume />} />
        </Route>
      </Route>

    </Routes>
  </div >
}