import {type Request, type Response} from 'express';
import { PrismaClient} from '@prisma/client';

const client = new PrismaClient();

// Get user profile
export const getUserProfile = async (req: Request, res: Response) => {
    try {
        const userId = req.user.id;
        const profile = await client.user.findUnique({
            where: {
                id: userId
            },
            select: {
                firstName: true,
                lastName: true,
                emailAddress: true,
                username: true,
                dateJoined: true,
                lastUpdated: true
            }
        });
        if (!profile) {
            return res.status(404).json({ message: "Profile not found"})
        }
        res.status(200).json(profile)
    } catch(e) {
        res.status(500).json({ message: "Something went wrong" })
    }
}

// Update user profile
export const updateProfile = async (req: Request, res: Response) => {
    try {
        const { firstName, lastName, emailAddress, username} = req.body;
        const userId = req.user.id;
        await client.user.update({
            where: {
                id: userId
            },
            data: {
                firstName: firstName && firstName,
                lastName: lastName && lastName,
                emailAddress: emailAddress && emailAddress,
                username: username && username
            }
        });
        res.status(200).json({ message: "Profile updated successfully" });
    } catch(e) {
        res.status(500).json({ message: "Something went wrong" });
    }
};

// Get blogs by a user
export const getUserBlogs = async (req: Request, res: Response) => {
    try {
        const userId = req.user.id;
        // console.log(req.user.id);
        const blogs = await client.blog.findMany({
            where: {
                userId,
                isDeleted: false
            },
            select: {
                title: true,
                synopsis: true,
                featuredImageUrl: true,
                content: true,
            }
        });
        res.status(200).json(blogs)
    } catch(e) {
        res.status(500).json({ message: "Something went wrong" })
    }
}

// Deleting a user profile
export const deleteProfile = async (req: Request, res: Response) => {
    try {
        const userId = req.user.id;

        await client.user.update({
            where: { 
                id: userId 
            },
            data: { 
                isDeleted: true
            }
        })
        return res.status(200).json({ message: "Account deleted successfully" });
    } catch(e) {
        res.status(500).json({ message: "Something went wrong"});
    }
}

// Get user's trash
export const getUserTrash = async (req: Request, res: Response) => {
    try {
        const userId = req.user.id;
        // console.log(req.user.id);
        const blogs = await client.blog.findMany({
            where: {
                userId,
                isDeleted: true
            },
            select: {
                title: true,
                synopsis: true,
                featuredImageUrl: true,
                content: true,
            }
        });
        res.status(200).json(blogs)
    } catch(e) {
        res.status(500).json({ message: "Something went wrong" })
    }
}
