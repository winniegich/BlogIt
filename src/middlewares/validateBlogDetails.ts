import {type Request, type Response, type NextFunction} from 'express';

export function validateBlogDetails(req: Request, res: Response, next: NextFunction) {
    const { title, synopsis, content,} = req.body;

    if(!title) {
        return res.status(400).json({ message: "Title is required"});
    }
    if(!synopsis) {
        return res.status(400).json({ message: "Synopsis is required"});
    }
    if(!content) {
        return res.status(400).json({ message: "Content is required"});
    }
    next();
}