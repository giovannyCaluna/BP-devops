import  { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { createClient } from 'redis';

dotenv.config();

const SECRET_KEY = process.env.JWT_SECRET || 'devops-secret-key';
const API_KEY = process.env.API_KEY || '2f5ae96c-b558-4c7b-a590-a501ae1c3f6c';
const REDIS_HOST = process.env.REDIS_HOST || 'localhost';

const redisClient = createClient({
    url: `redis://${REDIS_HOST}:6379`
});

redisClient.on('error', (err) => console.error('Redis Client Error', err));

(async () => {
    try {
        await redisClient.connect();
        console.log('Connected to Redis');
    } catch (e) {
        console.error('Failed to connect to Redis', e);
    }
})();

export const validateApiKey = (req: Request, res: Response, next: NextFunction) => {
    const apiKey = req.header('X-Parse-REST-API-Key');
    if (apiKey !== API_KEY) {
        return res.status(403).send('Forbidden');
    }
    next();
};

export const validateJwt = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.header('X-JWT-KWY');
    if (!token) {
        return res.status(401).send('Unauthorized');
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY) as jwt.JwtPayload;
        
        if (!decoded.jti) {
             return res.status(401).send('Invalid Token: Missing JTI');
        }

        const isUsed = await redisClient.get(decoded.jti);

        if (isUsed) {
            return res.status(401).send('Token already used');
        }

        await redisClient.set(decoded.jti, 'used', {
            EX: 24 * 60 * 60 // Expire in 24 hours
        });
        
        next();
    } catch (error) {
        return res.status(401).send('Invalid Token' + error);
    }
};
