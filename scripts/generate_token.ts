import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';


dotenv.config();

const SECRET_KEY = process.env.JWT_SECRET || 'devops-secret-key';

const generateTokens = (count: number, raw: boolean) => {
    if (!raw) console.log(`Generating ${count} JWT(s)...\n`);
    
    for (let i = 0; i < count; i++) {
        const payload = {
            sub: 'devops-test',
            jti: uuidv4(), // Unique ID for the token
        };

        const token = jwt.sign(payload, SECRET_KEY, {
            expiresIn: '1h',
        });

        if (raw) {
            process.stdout.write(token); 
        } else {
            console.log(`Token ${i + 1}:`);
            console.log(token);
            console.log('-----------------------------------');
        }
    }
};

const args = process.argv.slice(2);
const raw = args.includes('--raw');
const countArg = args.find(arg => !arg.startsWith('--'));
const count = countArg ? parseInt(countArg) : 1;

generateTokens(count, raw);
