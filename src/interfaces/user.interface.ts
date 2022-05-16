export interface User {
    id: number,
    username: string,
    email: string,
    password: string,
    deskripsi: string,
    picture: string
}

export interface UserData {
    username: string,
    email: string,
    password: string,
    deskripsi: string,
    roles: number[]
}

export interface UpdateUserData {
    username: string,
    email: string,
    deskripsi: string
}