import DB from "../databases";
import fs from 'fs';
import { Request } from "express";
import { HttpException } from "../exceptions/HttpException";
import { Attendance, AttendanceData, UpdateAttendanceData, User } from "../interfaces";

class AttendanceService {
    private attendances = DB.Attendance;
    private users = DB.Users;
    private roles = DB.Roles;

    public async getAttendanceByUser(userId: number): Promise<Attendance[]> {
        const user = await this.users.findByPk(userId);
        if (!user) throw new HttpException(400, "User not found");

        const attendances = await user.getAttendanceModels();
        return attendances;
    }

    public async getAttendanceByDate(date: string, role: string): Promise<Attendance[]> {
        const attendances = await this.attendances.findAll({
            include: {
                model: this.users,
                attributes: { exclude: ['password'] },
                include: [
                    {
                        model: this.roles,
                        where: {
                            name: role
                        },
                        required: true,
                        through: { attributes:[] }
                    }
                ],
                required: true,
            },
            where: { date: new Date(date) },
        });
        return attendances;
    }

    public async getAttendedUserByDate(date: string, role: string): Promise<User[]> {
        const users = await this.users.findAll({
            include: [
                {
                    model: this.attendances,
                    where: {
                        date: new Date(date)
                    },
                    required: true,
                },
                {
                    model: this.roles,
                    where: {
                        name: role
                    },
                    required: true
                }
            ]
        });

        return users;
    }

    public async getAttendanceStatus(userId: number, date: string, status: string): Promise<Attendance> {
        const attendance = await this.attendances.findOne({
            where: { date: new Date(date), status: status },
            include: {
                model: this.users,
                attributes: { exclude: ['password'] },
                where: {
                    id: userId
                },
                required: true
            }
        });
        if (!attendance) throw new HttpException(400, "You already attend");
        
        return attendance;
    }

    public async createAttendance(attendanceData: AttendanceData, userId: number, req: Request): Promise<Attendance> {
        const attendance = await this.attendances.findOne({
            where: { date: new Date(attendanceData.date), status: attendanceData.status },
            include: {
                model: this.users,
                where: {
                    id: userId
                },
                required: true
            }
        });
        if (attendance) throw new HttpException(400, "You already attend");

        if (!req.file) throw new HttpException(400, "Image must provided");
        let path = req.protocol + '://' + req.get('host') + "/static/images/" + req.file.filename; 

        const newAttendance = await this.attendances.create({...attendanceData, image: path});
        await newAttendance.setUserModel(userId);
        return newAttendance;
    }

    public async updateAttendance(updatedData: UpdateAttendanceData, attendanceId: number): Promise<Attendance> {
        const attendance = await this.attendances.findByPk(attendanceId);
        if (!attendance) throw new HttpException(400, "Attendance not found");

        await attendance.update(updatedData);
        return attendance;
    }

    public async deleteAttendance(attendanceId: number, req: Request): Promise<void> {
        const attendance = await this.attendances.findByPk(attendanceId);
        if (!attendance) throw new HttpException(400, "Attendance not found");

        const imagePath: string = attendance.image.replace(req.protocol + '://' + req.get('host') + '/', '');
        fs.unlinkSync(imagePath);

        await attendance.destroy();
    }
}

export default AttendanceService;