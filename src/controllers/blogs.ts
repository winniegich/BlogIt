import {type Request, type Response} from 'express';
import { PrismaClient} from '@prisma/client';

const client = new PrismaClient();

// Create a Blog
export const createBlog = async (req: Request, res: Response) => {
    try {
        const {title, synopsis, featuredImageUrl, content} = req.body;
        await client.blog.create({
            data: {
                title,
                synopsis,
                featuredImageUrl,
                content,
                userId: req.user.id
            }
        });
        res.status(201).json({ message: "Blog created successfully"});
        return;
    }catch(e) {
        res.status(500).json({ message: "Something went wrong"});
        return;
    }
};

// Get all Blogs
export const getBlogs = async (req: Request, res: Response) => {
    try {
        const userId = req.user.id;
        const blogs = await client.blog.findMany({
            where: {
                userId, 
                isDeleted: false
            }
        });
        res.status(200).json(blogs);
        return;
    }catch(e) {
        res.status(500).json({ message: "Something went wrong"});
        return;
    }
}

// Get a single Blog
export const getBlog = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const blog = await client.blog.findFirst({
            where: {
                id: String(id), 
                userId, 
                isDeleted: false
            }
        });
        if (!blog) {
            res.status(404).json({ message: "Blog not found"});
            return;
        }
        return res.status(200).json(blog);
    }catch(e) {
        res.status(500).json({ message: "Something went wrong"});
    }
}

// Delete a Blog
export const deleteBlog = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: "Blog id is required." });
        }

        const existingBlog = await client.blog.findMany({
            where: {
                AND: [
                    { id: String(id) },
                    { isDeleted: false }
                ]
            }
        });
        if (existingBlog.length === 0) {
            const anyBlog = await client.blog.findFirst({
                where: { id: String(id) }
            });
            
            if (!anyBlog) {
                return res.status(404).json({ message: "Blog not found" });
            } else {
                return res.status(400).json({ message: "Blog is already in trash." });
            }
        }

        const trashedBlog = await client.blog.update({
            where: {
                id: String(id)
            },
            data: {
                isDeleted: true
            }
        });
        res.status(200).json({ message: "Blog successfully moved to trash." });
    } catch (e) {
        res.status(500).json({ message: "Something went wrong. Please try again later." });
    }
}

// Fetch blogs in trash
export const trash = async(req: Request, res: Response) => {
    try {
        const userId = req.user.id;
        const blogs = await client.blog.findMany({
            where: {
                userId,
                isDeleted: true
            },
        });
        if (blogs.length === 0) {
            return res.status(200).json({ message: "Trash is empty"});
        }
        return res.status(200).json(blogs)
    }catch(e) {
        return res.status(500).json({ message: "Something went wrong"})
    }
}

// Recover a Blog from trash
export const recoverTrash = async(req: Request, res: Response) => {
    try{
        const {id} = req.params
        if (!id) {
            return res.status(400).json({
                message: "Blog id is required."
            });
        }
        const inTrash = await client.blog.findMany({
            where: {
                AND: [{id: String(id)}, {isDeleted: true}]
            }
        });
        if (inTrash.length === 0) {
            const blog = await client.blog.findFirst({
                where: {id: String(id)}
            });
            if(!blog){
                return res.status(404).json({ message: "Blog not found" });
            }else{
                res.status(200).json({ message: "Blog already restored" });
            }
        }
        const trashedBlog = await client.blog.update({
            where: {
                id: String(id)
            },
            data:{
                isDeleted: false
            }
        });
        res.status(200).json({ message: "Blog restored successfully.", blog: trashedBlog });
    }catch(err){
        res.status(500).json({ message: "Something went wrong. Please try again later." });
    }
}

// Update Blog
export const updateBlog = async (req: Request, res: Response) => {
    try {
        const {id} = req.params;
        const { title, synopsis, featuredImageUrl, content} = req.body;
        const userId = req.user.id;

        await client.blog.update({
            where: {
                id: String(id) ,
                userId
            },
            data: {
                title: title && title,
                synopsis: synopsis && synopsis,
                featuredImageUrl: featuredImageUrl && featuredImageUrl,
                content: content && content
            },
        })
        return res.status(200).json({ message: "Blog updated successfully" });
    } catch(e) {
        return res.status(500).json({ message: "Something went wrong"});
    }
};

// Permanent delete
export const deletePermanently = async(req: Request, res: Response) => {
    try{
        const {id} = req.params
        const userId = req.user?.id
        if (!userId) {
            return res.status(401).json({
                message: "Unauthorized. Please log in."
            });
        }
        const existing = await client.blog.findMany({
            where: {
                AND: [{id: String(id)}, {userId: String(userId)}]
            }
        });
        if(existing.length === 0){
            return res.status(404).json({ message: "Blog not found." });
        }
        const deletedBlog = await client.blog.deleteMany({
            where: {
                AND: [{id: String(id)}, {userId: String(userId)}]
            }
        });
        res.status(200).json({ message: "Blog deleted successfully." });
    }catch(e){ 
        res.status(500).json({ message: "Something went wrong. Please try again later." });
    }
}