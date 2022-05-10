import { Router } from "express";
import { Routes } from "../interfaces";
import UserController from "../controllers/user.controller";
import { uploadImage } from "../middlewares/upload.middleware";

export class UserRoute implements Routes {
    public path = '/user/';
    public router = Router();
    public userController = new UserController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(`${this.path}`, this.userController.getAllUser);
        this.router.get(`${this.path}:id`, this.userController.getUserById);
        this.router.post(`${this.path}`, uploadImage, this.userController.createUser);
        this.router.put(`${this.path}:id`, uploadImage, this.userController.updateUserById);
        this.router.put(`${this.path}change-password/:id`, this.userController.changePassword);
        this.router.delete(`${this.path}:id`, this.userController.deleteUserById);
    }
}