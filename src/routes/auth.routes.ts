import { Router } from "express";
import { Routes } from "../interfaces";
import AuthController from "../controllers/auth.controller";
import RoleMiddleware from "../middlewares/checkRole.middleware";

export class AuthRoute implements Routes {
    public path = '/auth/';
    public router = Router();
    public authController = new AuthController();
    public roleMiddleware = new RoleMiddleware();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post(`${this.path}sign-in`, this.authController.signIn);
    }
}