import { Request, Response } from 'express';

export default class HomeController {
    public index = (req: Request, res: Response) => {
        try {
            return res.status(200).send({
                message: "Hello, server is running"
            });
        } catch (error) {
            return res.status(404).send({
                message: error
            });
        }
    }
}