import express, {type Request, type Response} from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { checkDetails } from './middlewares/checkDetails.ts';
import { checkUsernameAndEmail } from './middlewares/checkUsernameAndEmail.ts';
import { checkPasswordStrength } from './middlewares/checkPasswordStrength.ts';
import { verifyToken } from './middlewares/verifyToken.ts';
import { validateBlogDetails } from './middlewares/validateBlogDetails.ts'
import {register, login, logout, updatePassword} from './controllers/auth.ts'
import { createBlog, getBlogs, getBlog, deleteBlog, recoverTrash, updateBlog, deletePermanently} from './controllers/blogs.ts'
import { getUserProfile, updateProfile, getUserBlogs, userTrash } from './controllers/user.ts';

const app = express();
dotenv.config();

app.use(express.json());
app.use(cookieParser());

app.get('/', (req:Request, res:Response) => {
    res.status(200).send('<h1>Welcome to BlogIt</h1>');
});

app.post('/auth/register', checkDetails, checkUsernameAndEmail, checkPasswordStrength, register);
app.post('/auth/login', login);
app.post('/auth/logout', logout);
app.patch("/auth/updatePassword", verifyToken, updatePassword)

// Blogs endpoints
app.post("/blogs",verifyToken,validateBlogDetails, createBlog)
app.get("/blogs", verifyToken, getBlogs)
app.get("/blogs/:id", verifyToken, getBlog)
app.patch("/blogs/:id", verifyToken, updateBlog)
app.patch("/blogs/trash/:id", verifyToken, deleteBlog)
app.delete("/blogs/:id", verifyToken, deletePermanently)
app.patch("/blogs/recover/:id", verifyToken, recoverTrash)

// User endpoints
app.get("/users", verifyToken, getUserProfile)
app.get("/users/blogs", verifyToken, getUserBlogs)
app.get("/users/trash", verifyToken, userTrash)
app.patch("/users/:id", verifyToken, updateProfile)

const PORT = 6000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});