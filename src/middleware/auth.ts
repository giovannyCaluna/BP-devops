import { Request, Response, NextFunction } from 'express';

export const validateApiKey = (req: Request, res: Response, next: NextFunction) => {
    const apiKey = req.header('X-Parse-REST-API-Key');
    if (apiKey !== '2f5ae96c-b558-4c7b-a590-a501ae1c3f6c') {
        return res.status(403).send('Forbidden');
    }
    next();
};

export const validateJwt = (req: Request, res: Response, next: NextFunction) => {
    const jwt = req.header('X-JWT-KWY');
    if (!jwt) {
        return res.status(401).send('Unauthorized');
    }
    next();
};
