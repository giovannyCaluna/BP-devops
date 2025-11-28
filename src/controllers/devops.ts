import { Request, Response } from 'express';

export const devOpsHandler = (req: Request, res: Response) => {
    const { to } = req.body;
    res.json({
        message: `Hello ${to} your message will be send`,
    });
};
