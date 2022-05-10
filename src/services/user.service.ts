import { Request } from "express";
import { hash } from "bcrypt";
import fs from 'fs';

import DB from "../databases";
import { UserData, User, UpdateUserData } from "../interfaces";
import { HttpException } from '../exceptions/HttpException';

class UserService {
    public users = DB.Users;
    public roles = DB.Roles;

    public async createNewUser(userData: UserData, req: Request): Promise<User> {
        const findUser = await this.users.findOne({ where: { email: userData.email } }); 
        if (findUser) throw new HttpException(409, `You're email ${userData.email} already exists`);

        const hashedPassword = await hash(userData.password, 10);
        let path: string = '';
        if (req.file) path = req.protocol + '://' + req.get('host') + "/static/images/" + req.file.filename; 

        const createUserData = await this.users.create({ ...userData, password: hashedPassword, picture: path });
        await createUserData.setRoleModels(userData.roles);
        return createUserData;
    }

    public async updateUserById(userId: number, userData: UpdateUserData, req: Request) {
        const findUser = await this.users.findByPk(userId); 
        if (!findUser) throw new HttpException(404, `User not found`);

        let path: string = findUser.picture;
        if (req.file) {
            if (path !== "") {
                const imagePath: string = findUser.picture.replace(req.protocol + '://' + req.get('host') + '/', '');
                fs.unlinkSync(imagePath);
            }
            path = req.protocol + '://' + req.get('host') + "/static/images/" + req.file.filename;
        }
        
        await findUser.update({ 
            username: userData.username, 
            email: userData.email, 
            deskripsi: userData.deskripsi, 
            picture: path 
        });
        return findUser;
    }

    public async changePassword(userId: number, newPassword: string): Promise<User> {
        const findUser = await this.users.findByPk(userId); 
        if (!findUser) throw new HttpException(404, `User not found`);

        const hashedPassword = await hash(newPassword, 10);
        findUser.password = hashedPassword;
        
        await findUser.save();
        return findUser;
    }

    public async deleteUserById(userId: number, req: Request): Promise<void> {
        const findUser = await this.users.findByPk(userId); 
        if (!findUser) throw new HttpException(404, `User not found`);

        if (findUser.picture !== "") {
            const imagePath: string = findUser.picture.replace(req.protocol + '://' + req.get('host') + '/', '');
            fs.unlinkSync(imagePath);
        }

        await findUser.destroy();
    }

    public async getUserById(userId: number): Promise<User> {
        const findUser = await this.users.findByPk(userId, {
            include: { model: this.roles }
        });
        if (!findUser) throw new HttpException(404, `User not found`); 
        
        return findUser;
    }

    public async getAllUser(): Promise<User[]> {
        return await this.users.findAll({
            include: { model: this.roles }
        });
    }
}

export default UserService;