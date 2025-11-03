import express, { type Request, type Response, type NextFunction} from 'express';
import PrismaClient from '@prisma/client';

const client = new PrismaClient.PrismaClient();

export async function checkUsernameAndEmail(req: Request, res: Response, next: NextFunction) {
    try {
        const { username, emailAddress } = req.body;
        const userWithEmail = await client.user.findUnique ({
            where: { emailAddress},
        });
        if (userWithEmail) {
            res.status(400).json({ message: 'Email address is already taken'});
            return;
        }

        const userWithUsername = await client.user.findUnique ({
            where: { username },
        });
        if (userWithUsername) {
            res.status(400).json({ message: 'Username is already taken'});
            return;
        }
        next();
    }catch(e) {
        res.status(500).json({ message: 'Something went wrong'});
    }
}