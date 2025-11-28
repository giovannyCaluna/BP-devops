import request from 'supertest';
import app from '../app';

describe('POST /DevOps', () => {
    const apiKey = '2f5ae96c-b558-4c7b-a590-a501ae1c3f6c';
    const jwt = 'some-jwt-token';

    it('should return 200 and correct message with valid headers and payload', async () => {
        const payload = {
            message: 'This is a test',
            to: 'Juan Perez',
            from: 'Rita Asturia',
            timeToLifeSec: 45,
        };

        const response = await request(app)
            .post('/DevOps')
            .set('X-Parse-REST-API-Key', apiKey)
            .set('X-JWT-KWY', jwt)
            .send(payload);

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            message: 'Hello Juan Perez your message will be send',
        });
    });

    it('should return 403 if API Key is invalid', async () => {
        const response = await request(app)
            .post('/DevOps')
            .set('X-Parse-REST-API-Key', 'invalid-key')
            .set('X-JWT-KWY', jwt)
            .send({});

        expect(response.status).toBe(403);
    });

    it('should return 401 if JWT is missing', async () => {
        const response = await request(app)
            .post('/DevOps')
            .set('X-Parse-REST-API-Key', apiKey)
            .send({});

        expect(response.status).toBe(401);
    });

    it('should return ERROR for other methods', async () => {
        const methods = ['get', 'put', 'delete', 'patch'];
        for (const method of methods) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const response = await (request(app) as any)[method]('/DevOps')
                .set('X-Parse-REST-API-Key', apiKey)
                .set('X-JWT-KWY', jwt);

            expect(response.text).toBe('ERROR');
        }
    });
});
