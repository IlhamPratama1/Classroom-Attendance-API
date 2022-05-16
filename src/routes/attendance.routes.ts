import { Router } from "express";
import { Routes } from "../interfaces";
import AttendanceController from "../controllers/attendance.controller";
import RoleMiddleware from "../middlewares/checkRole.middleware";
import { uploadImage } from "../middlewares/upload.middleware";

export class AttendanceRoute implements Routes {
    public path = '/attendance/';
    public router = Router();
    public attendanceController = new AttendanceController();
    public roleMiddleware = new RoleMiddleware();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(`${this.path}user/:id`, this.roleMiddleware.checkIfGuru, this.attendanceController.getAttendanceUser);
        this.router.get(`${this.path}date`, this.roleMiddleware.checkIfGuru, this.attendanceController.getAttendanceByDate);
        this.router.get(`${this.path}attended`, this.roleMiddleware.checkIfGuru, this.attendanceController.getAttendedUserByDate);
        this.router.post(`${this.path}create`, [
            this.roleMiddleware.checkIfUser,
            uploadImage
        ], this.attendanceController.createAttendance);
        this.router.get(`${this.path}check`, this.roleMiddleware.checkIfUser, this.attendanceController.checkAttendance);
        this.router.put(`${this.path}update/:id`, this.roleMiddleware.checkIAdmin, this.attendanceController.updateAttendance);
        this.router.delete(`${this.path}delete/:id`, this.roleMiddleware.checkIAdmin, this.attendanceController.deleteAttendance);
    }
}