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
        if (!findUser) throw new HttpException(400, `You're email ${userData.email} not found`);

        const isPasswordMatching: boolean = await bcrypt.compare(userData.password, findUser.password);
        if (!isPasswordMatching) throw new HttpException(400, "You're password not matching");

        let userRoles: string[] = [];
        const roles = await findUser.getRoleModels();
        roles.forEach(role => {
            userRoles.push(role.name);
        });

        const userAccessToken: string = this.createAccessToken(findUser.id);
        return { user: findUser, roles: userRoles, accessToken: userAccessToken };
    }

    public createAccessToken(userId: number): string {
        return jwt.sign({ id: userId }, SECRET_KEY as string);
    }
}

export default AuthService;