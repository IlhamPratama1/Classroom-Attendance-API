import jwt from 'jsonwebtoken';
import { NextFunction, Response } from "express"

import AuthService from "../services/auth.service";
import { SECRET_KEY } from "../config";
import { DataStoredInToken } from "../interfaces";
import { RequestWithUser } from "../interfaces/request.interface";

class RoleMiddleware {
    public checkIfUser = async (req: RequestWithUser, res: Response, next: NextFunction) => {
        try {
            const token = (req.header('Authorization'));
            if (!token) return res.status(401).send({ 'message': `Authentication token missing`});
            
            const tokenProvided = token.split('Bearer ')[1];
            const isValid = jwt.verify(tokenProvided, SECRET_KEY as string) as DataStoredInToken;

            const user = await new AuthService().checkUserValid(isValid.id);
            req.user = user;
            
            next();
        } catch (err) {
            return res.status(401).send(err);
        }
    }

    public checkIfSiswa = async (req: RequestWithUser, res: Response, next: NextFunction) => {
        try {
            const token = (req.header('Authorization'));
            if (!token) return res.status(401).send({ 'message': `Authentication token missing`});
            
            const tokenProvided = token.split('Bearer ')[1];
            const isValid = jwt.verify(tokenProvided, SECRET_KEY as string) as DataStoredInToken;

            const { user, isRole } = await new AuthService().checkUserRoleIs(isValid.id, 'siswa');
            if (!isRole) return res.status(401).send({ 'message': `Only siswa role provided`});

            req.user = user;
            next();
        } catch (err) {
            return res.status(401).send(err);
        }
    }

    public checkIfGuru = async (req: RequestWithUser, res: Response, next: NextFunction) => {
        try {
            const token = (req.header('Authorization'));
            if (!token) return res.status(401).send({ 'message': `Authentication token missing`});
            
            const tokenProvided = token.split('Bearer ')[1];
            const isValid = jwt.verify(tokenProvided, SECRET_KEY as string) as DataStoredInToken;

            const { user, isRole } = await new AuthService().checkUserRoleIs(isValid.id, 'guru');
            if (!isRole) return res.status(401).send({ 'message': `Only guru provided`});

            req.user = user;
            next();
        } catch (err) {
            return res.status(401).send(err);
        }
    }

    public checkIAdmin = async (req: RequestWithUser, res: Response, next: NextFunction) => {
        try {
            const token = (req.header('Authorization'));
            if (!token) return res.status(401).send({ 'message': `Authentication token missing`});
            
            const tokenProvided = token.split('Bearer ')[1];
            const isValid = jwt.verify(tokenProvided, SECRET_KEY as string) as DataStoredInToken;

            const { user, isRole } = await new AuthService().checkUserRoleIs(isValid.id, 'admin');
            if (!isRole) return res.status(401).send({ 'message': `Only admin provided`});

            req.user = user;
            next();
        } catch (err) {
            return res.status(401).send(err);
        }
    }

    public checkIfManager = async (req: RequestWithUser, res: Response, next: NextFunction) => {
        try {
            const token = (req.header('Authorization'));
            if (!token) return res.status(401).send({ 'message': `Authentication token missing`});
            
            const tokenProvided = token.split('Bearer ')[1];
            const isValid = jwt.verify(tokenProvided, SECRET_KEY as string) as DataStoredInToken;

            const { user, isRole } = await new AuthService().checkUserRoleIs(isValid.id, 'manager');
            if (!isRole) return res.status(401).send({ 'message': `Only manager provided`});

            req.user = user;
            next();
        } catch (err) {
            return res.status(401).send(err);
        }
    }
}

export default RoleMiddleware;