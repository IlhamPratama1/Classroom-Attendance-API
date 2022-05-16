import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import DB from "../databases";
import { SECRET_KEY } from '../config';
import { SignInData, User } from '../interfaces';
import { HttpException } from '../exceptions/HttpException';

class AuthService {
    public users = DB.Users;

    public async signIn(userData: SignInData): Promise<{ user: User, roles: string[], accessToken: string }> {
        const findUser = await this.users.findOne({ where: { email: userData.email } });
        if (!findUser) throw new HttpException(400, `Your email ${userData.email} not found`);

        const isPasswordMatching: boolean = await bcrypt.compare(userData.password, findUser.password);
        if (!isPasswordMatching) throw new HttpException(400, "Invalid password");

        let userRoles: string[] = [];
        const roles = await findUser.getRoleModels();
        roles.forEach(role => {
            userRoles.push(role.name);
        });

        const userAccessToken: string = this.createAccessToken(findUser.id);
        return { user: findUser, roles: userRoles, accessToken: userAccessToken };
    }

    public async checkUserValid(userId: number): Promise<User> {
        const user = await this.users.findByPk(userId);
        if (!user) throw new HttpException(400, `User with token not found`);

        return user;
    }

    public async checkUserRoleIs(userId: number, userRole: string): Promise<{ user: User, isRole: boolean }> {
        const user = await this.users.findByPk(userId);
        if (!user) throw new HttpException(400, `User with token not found`);
        const roles = await user.getRoleModels();

        let isRole: boolean = false;
        roles.forEach(role => { if (role.name === userRole || role.name === 'admin') isRole = true; });
        return { user: user, isRole: isRole };
    }

    public createAccessToken(userId: number): string {
        return jwt.sign({ id: userId }, SECRET_KEY as string);
    }
}

export default AuthService;