import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import helmet from 'helmet';

import devOpsRoutes from './routes/devops';
import { metricsMiddleware, register } from './middleware/metrics';

const app = express();

app.use(helmet());
app.use(cors());
app.use(bodyParser.json());

// Metrics middleware
app.use(metricsMiddleware);

// Prometheus metrics endpoint
app.get('/metrics', async (req, res) => {
    res.setHeader('Content-Type', register.contentType);
    const metrics = await register.metrics();
    res.send(metrics);
});

app.use('/DevOps', devOpsRoutes);

app.get('/', (req, res) => {
    res.send('Hello World');
});

export default app;
