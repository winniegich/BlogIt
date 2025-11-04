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
                isDeleted: false,
                isPermanentlyDeleted: false
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
        const userId = req.user.id;

        const result = await client.blog.updateMany({
            where: {
                id: String(id), 
                userId ,
                isDeleted: false,
                isPermanentlyDeleted: false
            },
            data: {
                isDeleted: true
            }
        });
        if (result.count === 0) {
            return res.status(404).json({ message: "Blog not found"});
        }
        return res.status(200).json({ message: "Blog moved to trash"});
    }catch(e) {
        res.status(500).json({ message: "Something went wrong"}); 
    }
};

// Move blog to trash
export const trash = async(req: Request, res: Response) => {
    try {
        const userId = req.user.id;
        const blogs = await client.blog.findMany({
            where: {
                userId,
                isDeleted: true,
                isPermanentlyDeleted: false
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
export const recoverDeletedBlog = async(req: Request, res:Response) => {
    try {
        const {id} = req.params;
        const userId = req.user.id;

        await client.blog.updateMany({
            where: {
                id: String(id),
                userId
            },
            data: {
                isDeleted: false
            },
        });
        return res.status(200).json({ message: "Blog recovered  successfully"});
    } catch(e) {
        return res.status(500).json({ message: "Something went wrong"});
    }
};

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
export const permanentDeleteBlog = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const blog = await client.blog.findUnique({
        where: { id: String(id) },
    });
    if (!blog) {
        return res.status(404).json({ message: "Blog already permanently deleted"});
    }
    if (!blog.isDeleted) {
        return res.status(400).json({ message: "You can only permanently delete trashed blogs"});
    }
    await client.blog.delete({
        where: { id: String(id) },
    });
    return res.status(200).json({ message: "Blog deleted permanently and cannot be recovered."});
    } catch (error) {
        return res.status(500).json({ message: "Something went wrong! Kindly try again."})
    }
};