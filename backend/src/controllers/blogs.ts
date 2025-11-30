import {type Request, type Response} from 'express';
import prisma from '../lib/prisma';

const client = prisma;

// Create a Blog
export const createBlog = async (req: Request, res: Response) => {
    try {
        console.log("=== CREATE BLOG REQUEST ===");
        console.log("📋 Content-Type:", req.headers["content-type"]);
        console.log("📝 Body:", req.body);
        console.log("📎 File:", req.file);
        const {title, synopsis, content} = req.body;
        const featuredImage = req.file 

        if (!title || !synopsis || !content) {
            console.log("❌ Missing required fields");
          return res.status(400).json({ message: "All fields are required" });
    }

        if (!req.user?.id) {
            console.log("❌ Unauthorized - no user ID");
            return res.status(401).json({ message: "Unauthorized" });
        }

        if (!featuredImage) {
            console.log("⚠️ No file uploaded!");
            return res.status(400).json({ message: "Featured image is required" });
        }

        console.log("✅ File received:");
        console.log("  - Filename:", featuredImage.filename);
        console.log("  - Original name:", featuredImage.originalname);
        console.log("  - Path:", featuredImage.path);
        console.log("  - Size:", featuredImage.size, "bytes");

        const featuredImageUrl = `${req.protocol}://${req.get("host")}/uploads/${featuredImage.filename}`;
    console.log("Generated URL:", featuredImageUrl);
        const blog = await client.blog.create({
            data: {
                title,
                synopsis,
                content,
                featuredImageUrl,
                userId: req.user.id
            }
        });
        console.log("✅ Blog created successfully!");
        console.log("  - ID:", blog.id);
        console.log("  - Image URL saved:", blog.featuredImageUrl);
        console.log("=========================");
        res.status(201).json({ message: "Blog created successfully", blog});
    }catch(e) {
        console.error("Create Blog Error:", e);
        res.status(500).json({ message: "Something went wrong"});
    }
};

// Get all Blogs
export const getBlogs = async (req: Request, res: Response) => {
    try {
        const userId = req.user.id;
        const blogs = await client.blog.findMany({
            where: {
                userId:req.user.id, 
                isDeleted: false
            },
            select: {
        id: true,
        title: true,
        synopsis: true,
        content: true,
        featuredImageUrl: true,   // <-- important
        createdAt: true,
        user: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
            orderBy: {
                createdAt: 'desc'
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

// Recover a Blog from trash
export const recoverTrash = async(req: Request, res: Response) => {
    try {
        const { id } = req.params;
        
        console.log("🔄 Recover request for blog ID:", id);
        
        if (!id) {
            return res.status(400).json({
                message: "Blog id is required."
            });
        }
        
        const inTrash = await client.blog.findFirst({
            where: {
                id: String(id),
                isDeleted: true
            }
        });
        
        if (!inTrash) {
            const blog = await client.blog.findFirst({
                where: { id: String(id) }
            });
            
            if (!blog) {
                console.log("❌ Blog not found:", id);
                return res.status(404).json({ message: "Blog not found" });
            } else {
                console.log("⚠️ Blog already restored:", id);
                return res.status(200).json({ message: "Blog already restored" });
            }
        }
        
        const restoredBlog = await client.blog.update({
            where: {
                id: String(id)
            },
            data: {
                isDeleted: false
            }
        });
        
        console.log("✅ Blog restored successfully:", id);
        res.status(200).json({ message: "Blog restored successfully.", blog: restoredBlog });
    } catch(err) {
        console.error("❌ Restore error:", err);
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
    try {
        const { id } = req.params;
        const userId = req.user?.id;
        
        console.log("🗑️ Permanent delete request for blog ID:", id, "by user:", userId);
        
        if (!userId) {
            return res.status(401).json({
                message: "Unauthorized. Please log in."
            });
        }
        
        const existing = await client.blog.findFirst({
            where: {
                id: String(id),
                userId: String(userId)
            }
        });
        
        if (!existing) {
            console.log("❌ Blog not found or unauthorized:", id);
            return res.status(404).json({ message: "Blog not found." });
        }
        
        await client.blog.delete({
            where: {
                id: String(id)
            }
        });
        
        console.log("✅ Blog deleted permanently:", id);
        res.status(200).json({ message: "Blog deleted successfully." });
    } catch(e) {
        console.error("❌ Delete error:", e);
        res.status(500).json({ message: "Something went wrong. Please try again later." });
    }
}
