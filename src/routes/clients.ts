import { verifyTokenMiddleware as auth } from '../auth/local.util';
import * as express from 'express';
import { fetch, insert } from '../db/database.handler';
import * as conf from '../db/config.json';
import { Client } from '../models/client.item';
import { SuccessResponse } from '../models/success.response';

const router: express.Router = express.Router();

router.get("/clients", auth, async (req: express.Request, resp: express.Response) => {
    // const clients = '(SELECT t1.*, t2.tag_id FROM ' 
    //     + conf.db.tables.clients 
    //     + ' AS t1 INNER JOIN ' 
    //     + conf.db.tables.client_tags 
    //     + ' AS t2 ON t1.id = t2.client_id)';
    // const data = innerJoin(conf.db.tables.tags, clients, 'tag_id', 'id', new DbItem({}));
    const data = await fetch(conf.db.tables.clients, new Client({}));
    new SuccessResponse().setData(data).send(resp);
});

router.post("/clients", auth, async (req: express.Request, resp: express.Response) => {
    const client = new Client(req.body);
    client.generateId();
    insert(conf.db.tables.clients, client);
    new SuccessResponse().setData(client).send(resp);
});




module.exports = router;