import { verifyTokenMiddleware as auth } from '../auth/local.util';
import * as express from 'express';
import { fetch, insert, update } from '../db/database.handler';
import * as conf from '../db/config.json';
import { Client } from '../models/client.item';
import { SuccessResponse } from '../models/success.response';

const router: express.Router = express.Router();

router.get("/clients", auth, async (req: express.Request, resp: express.Response) => {
   const data = await fetch(conf.db.tables.clients, new Client({}));
    new SuccessResponse().setData(data).send(resp);
});


router.get("/clients/:id", auth, async (req: express.Request, resp: express.Response) => {
    const data = await fetch(conf.db.tables.clients, new Client({id: req.params['id']}));
    new SuccessResponse().setData(data).send(resp);
});

router.patch("/clients", auth, async (req: express.Request, resp: express.Response) => {
    const data = await update(conf.db.tables.clients, new Client(req.body));
    new SuccessResponse().setData(data).send(resp);
});

router.post("/clients", auth, async (req: express.Request, resp: express.Response) => {
    const client = new Client(req.body);
    client.generateId();
    insert(conf.db.tables.clients, client);
    new SuccessResponse().setData(client).send(resp);
});




module.exports = router;