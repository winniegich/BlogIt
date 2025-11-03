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
            return res.status(400).json({ message: "Wrong user details"});
        }
        const passwordsMatch = await bcrypt.compare(password, user.password);
        if(!passwordsMatch) {
            return res.status(400).json({ message: "Wrong password details"});
        }
        const payload = {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            username: user.username,
            emailAddress: user.emailAddress,
        };
        const token = jwt.sign(payload, process.env.JWT_SECRET_KEY!, { expiresIn: '14d' });
        return res.status(200).cookie("authToken", token).json(payload);
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