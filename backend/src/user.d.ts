import * as express from "express";

interface User {
    id: string;
    firstName: string;
    lastName: string;
    emailAddress: string;
    username: string;
}

declare global {
    namespace Express {
        interface Request {
            user: User;
        }
    }
}