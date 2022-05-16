import { Request, Response } from 'express';

import { User, UserData } from '../interfaces';
import { RequestWithUser } from '../interfaces/request.interface';
import UserService from '../services/user.service';

class UserController {
    private userService = new UserService();

    public getUserDetail = async (req: RequestWithUser, res: Response) => {
        try {
            return res.status(200).send(req.user);
        } catch (error) {
            res.status(400).send({  'message': `${error}` });
        }
    }

    public getAllUser = async (req: Request, res: Response) => {
        try {
            const users: User[] = await this.userService.getAllUser();
            return res.status(200).send(users);
        } catch (error) {
            res.status(400).send({  'message': `${error}` });
        }
    }

    public getUserById = async (req: Request, res: Response) => {
        try {
            const user: User = await this.userService.getUserById(Number(req.params.id));
            return res.status(200).send(user);
        } catch (error) {
            res.status(400).send({  'message': `${error}` });
        }
    }

    public createUser = async (req: Request, res: Response) => {
        try {
            const userData: UserData = req.body;
            const user: User = await this.userService.createNewUser(userData, req);
            return res.status(200).send(user);
        } catch (error) {
            res.status(400).send({  'message': `${error}` });
        }
    }

    public updateUserById = async (req: Request, res: Response) => {
        try {
            const userData: UserData = req.body;
            const user: User = await this.userService.updateUserById(Number(req.params.id), userData, req);
            return res.status(200).send(user);
        } catch (error) {
            res.status(400).send({  'message': `${error}` });
        }
    }

    public changePassword = async (req: Request, res: Response) => {
        try {
            const password: string = req.body.password;
            const user: User = await this.userService.changePassword(Number(req.params.id), password);
            return res.status(200).send(user);
        } catch (error) {
            res.status(400).send({  'message': `${error}` });
        }
    }

    public deleteUserById = async (req: Request, res: Response) => {
        try {
            await this.userService.deleteUserById(Number(req.params.id), req);
            return res.status(200).send({ 'message': 'Delete User Success' });
        } catch (error) {
            res.status(400).send({  'message': `${error}` });
        }
    }
}

export default UserController;