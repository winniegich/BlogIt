import express, {type Request, type Response} from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import {PrismaClient} from '@prisma/client';

const client = new PrismaClient();

// Registration endpoint
export const register = async function(req: Request, res: Response) {
    try {
        const { firstName, lastName, username, emailAddress, password} = req.body;
        const hashedPassword = await bcrypt.hash(password, 11);
        await client.user.create({
           data: {
            firstName,
            lastName,
            username,
            emailAddress,
            password : hashedPassword
           }
        })
        res.status(201).json({ message: "User registered successfully"});  
    }catch(e) { 
        res.status(500).json({ message: "Something went wrong"})
    }
};

// Login endpoint
export const login = async function (req: Request, res: Response) {
    try {
        const { identifier, password } = req.body;
        const user = await client.user.findFirst({
            where: {
                OR: [{ emailAddress: identifier }, { username: identifier }],
            },
        });
        if(!user) {
            return res.status(404).json({ message: "User not found"});
        }
        const passwordsMatch = await bcrypt.compare(password, user.password);
        if(!passwordsMatch) {
            return res.status(401).json({ message: "Invalid credentials"});
        }
        const payload = {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            username: user.username,
            emailAddress: user.emailAddress,
        };
        const token = jwt.sign(payload, process.env.JWT_SECRET_KEY!, { expiresIn: '14d' });
        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
            maxAge: 14 * 24 * 60 * 1000
        });
        res.status(200).json({ message: "Login successful", token, user: payload });
    }catch(e) {
        res.status(500).json({ message: "Something went wrong"});
    }
};

// Logout endpoint
export const logout = function (req: Request, res: Response) {
    try {
        res.status(200).clearCookie("authToken").json({ message: "Logged out successfully" });
    }catch(e) {
        res.status(500).json({ message: "Something went wrong.Unable to logout"});
    }
};

// Update user's password
export const updatePassword = async (req: Request, res: Response) => {
    try {
        const { previousPassword, password } = req.body;
        const userId = req.user.id;
        const user = await client.user.findUnique({
            where: { id: userId }
        })
        if (!user) {
            res.status(400).json({ message: "User does not exist" })
            return
        }
        const passwordsMatch = await bcrypt.compare(previousPassword, user.password);
        if (!passwordsMatch) {
            res.status(400).json({ message: "Previous password is wrong"});
            return;
        }
        const newPassword = await bcrypt.hash(password, 11);
        await client.user.update({
            where: {
                id: userId
            },
            data: {
                password: newPassword
            }
        })
        res.status(200).json({ message: "Password updated successfully" });
    } catch(e) {
        res.status(500).json({ message: "Something went wrong"});
    }
}