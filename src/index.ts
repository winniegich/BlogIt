import express, {type Request, type Response} from 'express';
import { checkDetails } from './middlewares/checkDetails.ts';
import { checkUsernameAndEmail } from './middlewares/checkUsernameAndEmail.ts';
import { checkPasswordStrength } from './middlewares/checkPasswordStrength.ts';
import {register, login, logout} from './controllers/auth.ts'

const app = express();

app.use(express.json());

app.get('/', (req:Request, res:Response) => {
    res.status(200).send('<h1>Welcome to BlogIt</h1>');
});

app.post('/auth/register', checkDetails, checkUsernameAndEmail, checkPasswordStrength, register);
app.post('/auth/login', login);
app.post('/auth/logout', logout);

const PORT = 6000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});