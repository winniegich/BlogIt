import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import PublicLayout from "./layout/PublicLayout";
import UserLayout from "./layout/UserLayout";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Blogs from "./pages/Blogs";
import NotFound from "./pages/NotFound";

import UserPage from "./pages/UserPage";
import NewBlog from "./pages/NewBlog";
import Profile from "./pages/Profile";
import BlogDetails from "./pages/BlogDetails";
import EditBlog from "./pages/EditBlog";
import Trash from "./pages/Trash.tsx";

const client = new QueryClient();

const App: React.FC = () => {
  return (
    <QueryClientProvider client={client}>
      <Router>
        <Routes>

          {/* Public Pages */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
          </Route>

          {/* Authenticated User Pages */}
          <Route element={<UserLayout />}>
            <Route path="/userPage" element={<UserPage />} />
            {/* <Route path="/userPage" element={<UserPage blogs={sampleBlogs}/>} /> */}
            <Route path="/blogs" element={<Blogs />} />
            <Route path="/blog/:id" element={<BlogDetails />} />
            <Route path="/new-blog" element={<NewBlog />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/edit-blog/:id" element={<EditBlog />} />
            <Route path="/trash" element={<Trash />} />

          </Route>

          {/* Not Found */}
          <Route path="*" element={<NotFound />} />

        </Routes>
      </Router>
    </QueryClientProvider>
  );
};

export default App;
