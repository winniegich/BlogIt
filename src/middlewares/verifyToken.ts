import { type Request, type Response, type NextFunction} from 'express';
import jwt from 'jsonwebtoken' ;

// declare global {
//     namespace Express {
//         interface Request {
//             user: User;
//             cookies?: Record<string,string>;
//         }
//     }
// }

interface User {
    id: string;
    firstName: string;
    lastName: string;
    emailAddress: string;
    username: string;
}

export function verifyToken(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies.token;

  if (!token) {
    res.status(401).json({ message: "Unauthorized! Please login." });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY!);
    req.user = decoded as User;
    next();
  } catch (error) {
    res.status(500).json({ message: "Something went wrong! Please try again." });
  }
}