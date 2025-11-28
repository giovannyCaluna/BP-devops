import { Router } from 'express';
import { devOpsHandler } from '../controllers/devops';
import { validateApiKey, validateJwt } from '../middleware/auth';

const router = Router();

router.post('/', validateApiKey, validateJwt, devOpsHandler);

router.all('/', (req, res) => {
    res.send('ERROR');
});

export default router;
