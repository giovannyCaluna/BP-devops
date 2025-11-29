import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const SECRET_KEY = process.env.JWT_SECRET || 'devops-secret-key';
const API_KEY = process.env.API_KEY || '2f5ae96c-b558-4c7b-a590-a501ae1c3f6c';
const usedTokens = new Set<string>();

export const validateApiKey = (req: Request, res: Response, next: NextFunction) => {
    const apiKey = req.header('X-Parse-REST-API-Key');
    if (apiKey !== API_KEY) {
        return res.status(403).send('Forbidden');
    }
    next();
};

export const validateJwt = (req: Request, res: Response, next: NextFunction) => {
    const token = req.header('X-JWT-KWY');
    if (!token) {
        return res.status(401).send('Unauthorized');
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY) as jwt.JwtPayload;
        
        if (!decoded.jti) {
             return res.status(401).send('Invalid Token: Missing JTI');
        }

        if (usedTokens.has(decoded.jti)) {
            return res.status(401).send('Token already used');
        }

        usedTokens.add(decoded.jti);
        
        // Cleanup old tokens (optional, simple implementation)
        if (usedTokens.size > 1000) {
            usedTokens.clear();
        }

        next();
    } catch (err) {
        return res.status(401).send('Invalid Token');
    }
};
