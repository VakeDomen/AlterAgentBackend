import { verifyTokenMiddleware as auth } from '../auth/local.util';
import * as express from 'express';
import { fetchAll, insert, leftJoin, deleteItem } from '../db/database.handler';
import * as conf from '../db/config.json';
import { ClientTag } from '../models/client-tag.item';
import { Tag } from '../models/tag.item';
import { SuccessResponse } from '../models/success.response';

const router: express.Router = express.Router();

router.get("/tags", auth, async (req: express.Request, resp: express.Response) => {
    const data = await fetchAll(conf.db.tables.tags);
    new SuccessResponse().setData(data).send(resp);
});

router.post("/tags", auth, async (req: express.Request, resp: express.Response) => {
    const tag = new Tag(req.body);
    tag.generateId();
    console.log(await insert(conf.db.tables.tags, tag));
    new SuccessResponse().setData(tag).send(resp);
});

router.get("/tags/client/:client", auth, async (req: express.Request, resp: express.Response) => {
    const client_tag = new ClientTag({client_id: req.params['client']});
    const data = await leftJoin(conf.db.tables.client_tags, conf.db.tables.tags, 'tag_id', 'id', client_tag);
    new SuccessResponse().setData(data).send(resp);
});

router.post("/tags/bind", auth, async (req: express.Request, resp: express.Response) => {
    const client_tag = new ClientTag(req.body);
    client_tag.generateId();
    insert(conf.db.tables.client_tags, client_tag);
    new SuccessResponse().setData(client_tag).send(resp);
});

router.post("/tags/unbind", auth, async (req: express.Request, resp: express.Response) => {
    const client_tag = new ClientTag(req.body);
    await deleteItem(conf.db.tables.client_tags, client_tag);
    new SuccessResponse().setData(client_tag).send(resp);
});

router.delete('/tags/:id', auth, async (req: express.Request, resp: express.Response) => {
    const tag = new Tag({id: req.params['id']});
    await deleteItem(conf.db.tables.tags, tag);
    await deleteItem(conf.db.tables.client_tags, new ClientTag({tag_id: tag.id}));
    new SuccessResponse().setData(tag).send(resp);
})

module.exports = router;