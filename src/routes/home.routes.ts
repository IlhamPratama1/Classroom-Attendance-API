import { Router } from "express";
import { Routes } from "../interfaces";
import IndexController from "../controllers/home.controller";

export class HomeRoute implements Routes {
    public path = '/';
    public router = Router();
    public indexController = new IndexController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get("/", this.indexController.index);
    }
}