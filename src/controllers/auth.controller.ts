import { Request, Response } from 'express';
import { SignInData } from '../interfaces';

import AuthService from '../services/auth.service';

class AuthController {
    private authService = new AuthService();
    
    public signIn = async (req: Request, res: Response) => {
        try {
            const userData: SignInData = req.body;
            const user = await this.authService.signIn(userData);
            return res.status(200).send(user);
        } catch (error) {
            return res.status(400).send({  'message': `${error}` });
        }
    }
}

export default AuthController;