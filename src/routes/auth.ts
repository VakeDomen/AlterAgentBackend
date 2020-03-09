import { login, register } from '../auth/local.util';
import * as express from 'express';
import { Response } from '../models/response';

const router: express.Router = express.Router();

router.post("/auth/local/register", async (req: express.Request, resp: express.Response) => {
    const response: Response = await register(req);
    response.send(resp);
});

router.post("/auth/local/login", async (req: express.Request, resp: express.Response) => {
    const response: Response = await login(req);
    response.send(resp);
});

module.exports = router;