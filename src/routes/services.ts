import { verifyTokenMiddleware as auth } from '../auth/local.util';
import * as express from 'express';
import { fetchAll, insert, deleteItem } from '../db/database.handler';
import * as conf from '../db/config.json';
import { Service } from '../models/service.item';
import { SuccessResponse } from '../models/success.response';

const router: express.Router = express.Router();

router.get("/services", auth, async (req: express.Request, resp: express.Response) => {
    const data = await fetchAll(conf.db.tables.services);
    new SuccessResponse().setData(data).send(resp);
});

router.post("/services", auth, async (req: express.Request, resp: express.Response) => {
    const service = new Service(req.body);
    service.generateId();
    console.log(await insert(conf.db.tables.services, service));
    new SuccessResponse().setData(service).send(resp);
});

router.delete("/services", auth, async (req: express.Request, resp: express.Response) => {
    const service = new Service(req.body);
    console.log(await deleteItem(conf.db.tables.services, service));
    new SuccessResponse().setData(service).send(resp);
});

module.exports = router;