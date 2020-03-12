import { ErrorResponse } from './../models/error.response';
import { verifyTokenMiddleware as auth } from '../auth/local.util';
import * as express from 'express';
import { fetchAll, insert, deleteItem } from '../db/database.handler';
import * as conf from '../db/config.json';
import { Service } from '../models/service.item';
import { SuccessResponse } from '../models/success.response';

const router: express.Router = express.Router();

router.get("/services", auth, async (req: express.Request, resp: express.Response) => {
    const data = await fetchAll(conf.db.tables.services).catch(err => {
        new ErrorResponse().setError(err).send(resp);
    });
    new SuccessResponse().setData(data).send(resp);
});

router.post("/services", auth, async (req: express.Request, resp: express.Response) => {
    const service = new Service(req.body);
    service.generateId();
    await insert(conf.db.tables.services, service).catch(err => {
        new ErrorResponse().setError(err).send(resp);
    });
    new SuccessResponse().setData(service).send(resp);
});

router.delete("/services/:id", auth, async (req: express.Request, resp: express.Response) => {
    const service = new Service({id: req.params['id']});
    await deleteItem(conf.db.tables.services, service).catch(err => {
        new ErrorResponse().setError(err).send(resp);
    });
    new SuccessResponse().setData(service).send(resp);
});

module.exports = router;