import { ErrorResponse } from './../models/error.response';
import { verifyTokenMiddleware as auth } from '../auth/local.util';
import * as express from 'express';
import { fetch, insert, deleteItem } from '../db/database.handler';
import * as conf from '../db/config.json';
import { Session } from '../models/session.item';
import { SuccessResponse } from '../models/success.response';

const router: express.Router = express.Router();

router.get("/sessions/:clientId", auth, async (req: express.Request, resp: express.Response) => {
    const data = await fetch(conf.db.tables.sessions, new Session({client_id: req.params['clientId']})).catch(err => {
        new ErrorResponse().setError(err).send(resp);
    });
    new SuccessResponse().setData(data).send(resp);
});

router.post("/sessions", auth, async (req: express.Request, resp: express.Response) => {
    const session = new Session(req.body);
    session.generateId();
    await insert(conf.db.tables.sessions, session).catch(err => {
        new ErrorResponse().setError(err).send(resp);
    });
    new SuccessResponse().setData(session).send(resp);
});

router.delete("/sessions/:id", auth, async (req: express.Request, resp: express.Response) => {
    const session = new Session({id: req.params['id']});
    await deleteItem(conf.db.tables.sessions, session).catch(err => {
        new ErrorResponse().setError(err).send(resp);
    });
    new SuccessResponse().setData(session).send(resp);
});

module.exports = router;