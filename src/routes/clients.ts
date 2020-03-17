import { ErrorResponse } from './../models/error.response';
import { Session } from './../models/session.item';
import { ClientTag } from './../models/client-tag.item';
import { Client } from './../models/client.item';
import { verifyTokenMiddleware as auth } from '../auth/local.util';
import * as express from 'express';
import { fetch, insert, update, deleteItem } from '../db/database.handler';
import * as conf from '../db/config.json';
import { SuccessResponse } from '../models/success.response';
import { DbItem } from '../models/db.item';

const router: express.Router = express.Router();

router.get("/clients", auth, async (req: express.Request, resp: express.Response) => {
    const data = await fetch(conf.db.tables.clients, new Client({})).catch(err => {
        new ErrorResponse().setError(err).send(resp);
    });
    new SuccessResponse().setData(data).send(resp);
});

router.get('/clients/tag/:tagId', auth, async (req: express.Request, resp: express.Response) => {
    let data = [];
    const client_tags: ClientTag[] | void = await fetch<ClientTag>(conf.db.tables.client_tags, new ClientTag({tag_id: req.params['tagId']})).catch(err => {
        new ErrorResponse().setError(err).send(resp);
    });
    if (client_tags) {
        const promises: Promise<Client[]>[] = [];
        for (const clientTag of client_tags) {
            promises.push(fetch<Client>(conf.db.tables.clients, new Client({id: clientTag.client_id })));
        }
        Promise.all(promises)
        .then(payload => {new SuccessResponse().setData(payload).send(resp)})
        .catch(err => {new ErrorResponse().setError(err).send(resp)});
    } else {
        new ErrorResponse().send(resp);
    }
});

router.get("/clients/:id", auth, async (req: express.Request, resp: express.Response) => {
    const data = await fetch(conf.db.tables.clients, new Client({id: req.params['id']})).catch(err => {
        new ErrorResponse().setError(err).send(resp);
    });
    new SuccessResponse().setData(data).send(resp);
});

router.patch("/clients", auth, async (req: express.Request, resp: express.Response) => {
    const data = await update(conf.db.tables.clients, new Client(req.body)).catch(err => {
        new ErrorResponse().setError(err).send(resp);
    });
    new SuccessResponse().setData(data).send(resp);
});

router.post("/clients", auth, async (req: express.Request, resp: express.Response) => {
    const client = new Client(req.body);
    client.generateId();
    await insert(conf.db.tables.clients, client).catch(err => {
        new ErrorResponse().setError(err).send(resp);
    });
    new SuccessResponse().setData(client).send(resp);
});

router.delete('/clients/:id', auth, async (req: express.Request, resp: express.Response) => {
    const client = new Client({id: req.params['id']});
    await deleteItem(conf.db.tables.clients, client).catch(err => {
        new ErrorResponse().setError(err).send(resp);
    });
    await deleteItem(conf.db.tables.client_tags, new ClientTag({client_id: client.id})).catch(err => {
        new ErrorResponse().setError(err).send(resp);
    });
    await deleteItem(conf.db.tables.sessions, new Session({client_id: client.id})).catch(err => {
        new ErrorResponse().setError(err).send(resp);
    });
    new SuccessResponse().setData(client).send(resp);
});

module.exports = router;