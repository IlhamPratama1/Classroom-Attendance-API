import fs from 'fs';
import { Request, Response } from 'express';
import { Attendance, AttendanceData, User } from '../interfaces';
import { RequestWithUser } from '../interfaces/request.interface';
import AttendanceService from '../services/attendance.service';
import PaginationService from '../services/pagiantion.service';

class AttendanceController {
    private attendanceService = new AttendanceService();
    private pagination = new PaginationService(20);

    public getAttendanceUser = async (req: Request, res: Response) => {
        try {
            const userId: number = Number(req.params.id);
            const page = req.query.page as string;
            const attendances: Attendance[] = await this.attendanceService.getAttendanceByUser(userId);
            return res.status(200).send(this.pagination.paginate<Attendance>(attendances, page));
        } catch (err) {
            return res.status(400).send({ 'message': `${err}` });
        }
    }

    public getAttendedUserByDate = async (req: Request, res: Response) => {
        try {
            const users: User[] = await this.attendanceService.getAttendedUserByDate(req.query.date as string, req.query.role as string);
            return res.status(200).send(this.pagination.paginate<User>(users, req.query.page as string));
        } catch (err) {
            return res.status(400).send({ 'message': `${err}` });
        }
    }

    public getAttendanceByDate = async (req: Request, res: Response) => {
        try {
            const attendances: Attendance[] = await this.attendanceService.getAttendanceByDate(req.query.date as string, req.query.role as string);
            return res.status(200).send(this.pagination.paginate<Attendance>(attendances, req.query.page as string));
        } catch (err) {
            return res.status(400).send({ 'message': `${err}` });
        }
    }

    public createAttendance = async (req: RequestWithUser, res: Response) => {
        try {
            const attendanceData: AttendanceData = req.body;
            const attendance = await this.attendanceService.createAttendance(attendanceData, req.user.id, req);
            return res.status(200).send(attendance);
        } catch (err) {
            if (req.file) fs.unlinkSync(req.file.path);
            return res.status(400).send({ 'message': `${err}` });
        }
    }

    public updateAttendance = async (req: Request, res: Response) => {
        try {
            const attendanceData: AttendanceData = req.body;
            const attendance = await this.attendanceService.updateAttendance(attendanceData, Number(req.params.id));
            return res.status(200).send(attendance);
        } catch (err) {
            return res.status(400).send({ 'message': `${err}` });
        }
    }

    public checkAttendance = async (req: RequestWithUser, res: Response) => {
        try {
            const attendance = await this.attendanceService.getAttendanceStatus(req.user.id, req.query.date as string, req.query.status as string);
            return res.status(200).send(attendance);
        } catch (err) {
            return res.status(400).send({ 'message': `${err}` });
        }
    }

    public deleteAttendance = async (req: Request, res: Response) => {
        try {
            await this.attendanceService.deleteAttendance(Number(req.params.id), req);
            return res.status(200).send({ message: "Delete attendance success" });
        } catch (err) {
            return res.status(400).send({ 'message': `${err}` });
        }
    }
}

export default AttendanceController;