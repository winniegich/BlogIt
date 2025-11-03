import express, { type Request, type Response, type NextFunction} from 'express';

export function checkDetails(req: Request, res: Response, next: Function) {
    const {firstName, lastName, username, emailAddress, password} = req.body;
    if(!firstName){
        res.status(400).json({ message: 'First name is required'});
        return;
    }
    if(!lastName){
        res.status(400).json({ message: 'Last name is required'});
        return;
    }
    if(!username){
        res.status(400).json({ message: 'username is required'});
        return;
    }
    if(!emailAddress){
        res.status(400).json({ message: 'Email address is required'});
        return;
    }
    if(!password){
        res.status(400).json({ message: 'Password is required'});
        return;
    }
    next();
}