import { create } from "zustand";
import type { Blog } from "../pages/UserPage";

interface BlogState {
  blogs: Blog[];
  setBlogs: (blogs: Blog[]) => void;
  addBlog: (blog: Blog) => void;
  deleteBlog: (id: string) => void;
}

export const useBlogStore = create<BlogState>((set) => ({
  blogs: [],
  setBlogs: (blogs) => set({ blogs }),
  addBlog: (blog) =>
    set((state) => ({ blogs: [blog, ...state.blogs] })),
  deleteBlog: (id) =>
    set((state) => ({
      blogs: state.blogs.filter((b) => b.id !== id),
    })),
}));
