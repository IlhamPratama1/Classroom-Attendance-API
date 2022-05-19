import { Router } from "express";
import { Routes } from "../interfaces";
import UserController from "../controllers/user.controller";
import { uploadImage } from "../middlewares/upload.middleware";
import RoleMiddleware from "../middlewares/checkRole.middleware";

export class UserRoute implements Routes {
    public path = '/user/';
    public router = Router();
    public userController = new UserController();
    public roleMiddleware = new RoleMiddleware();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(`${this.path}all`, this.roleMiddleware.checkIfManager, this.userController.getAllUser);
        this.router.get(`${this.path}id/:id`, this.roleMiddleware.checkIfManager, this.userController.getUserById);
        this.router.get(`${this.path}detail`, this.roleMiddleware.checkIfUser, this.userController.getUserDetail);
        this.router.post(`${this.path}create`, [
            uploadImage
        ], this.userController.createUser);
        this.router.put(`${this.path}update/:id`, [
            this.roleMiddleware.checkIAdmin,
            uploadImage
        ], this.userController.updateUserById);
        this.router.put(`${this.path}change-password/:id`, this.userController.changePassword);
        this.router.delete(`${this.path}delete/:id`, this.roleMiddleware.checkIAdmin, this.userController.deleteUserById);
    }
}