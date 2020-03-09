import { LocalCredentials } from '../models/local.credentials';
import { SuccessResponse } from '../models/success.response';
import { Response } from '../models/response';
import { ErrorResponse } from '../models/error.response';
import { User } from '../models/user.item'
import { fetch, insert } from '../db/database.handler';
import * as express from 'express';
import * as config from '../db/config.json';
import * as jwt from 'jsonwebtoken';

export async function login(reqest: express.Request): Promise<Response> {
    const credentials: LocalCredentials = extractCredentials(reqest);
    if (!validCredentials(credentials)) {
        return new ErrorResponse(400, 'Invalid credentials');
    }
    const users = await fetch(config.db.tables.users, new User({ email: credentials.email }));
    if (!users || users.length !== 1) {
        return new ErrorResponse(401, 'Unauthorized!');
    }
    const user = new User(users.pop());
    console.log(user);
    if(!user.isPasswordSame(credentials.password)) {
        return new ErrorResponse(401, 'Unauthorized!');
    }
    const token = await jwt.sign(JSON.stringify(user), process.env.JWT_SECRET);
    return new SuccessResponse().setData(token);
}

export async function register(request: express.Request): Promise<Response> {
    const user = new User(request.body);
    const existingUser = await fetch(config.db.tables.users, new User({ email: user.email }));
    if (existingUser && existingUser.length > 0) {
        return new ErrorResponse(409, 'User with that email already exists!');
    }
    if (!user.isValid()) {
        return new ErrorResponse(400, 'Invalid credentials!');
    }
    user.generateId();
    await user.hashPassword();
    await insert(config.db.tables.users, user);
    return new SuccessResponse(201, 'User registered');
}

export async function verifyTokenMiddleware(req: express.Request, resp: express.Response, next: any): Promise<void> {
    const extraction: string | ErrorResponse = extractToken(req);
    console.log("extraction", extraction);
    let token: string = '';
    if (typeof extraction !== 'string') {
        new ErrorResponse(401, 'Unauthorized').send(resp);
    } else {
        token = extraction;
    }
    const userJSON: string | null | void =  await varifyToken(token)
    .catch(() => new ErrorResponse(401, 'Unauthorized').send(resp));
    console.log("json", userJSON);
    if (!userJSON) {
        new ErrorResponse(401, 'Unauthorized').send(resp);
    } else {
        const user: User = new User(userJSON);
        const loggedUser = await fetch(config.db.tables.users, user);
        Object.assign(req, { token: token, loggedUser: loggedUser.pop() });
        next();
    }    
}
/*
    TODO: blacklist (token deleted on frontend)
*/
export function logout(): Response {
    return new SuccessResponse();
}

async function varifyToken(token): Promise<string | null> {
    return await jwt.verify(token, process.env.JWT_SECRET);
}

function validCredentials(crednetials: LocalCredentials): boolean {
    if (!crednetials.email || !crednetials.password) {
        return false;
    }
    return true;
}

function extractToken(request: express.Request): string | ErrorResponse {
    const extraction: string | string[] | undefined = request.headers['authorization'];
    if (typeof extraction !== 'string') {
        return new ErrorResponse(401, 'Unauthorized');
    } else {
        return extraction.replace('Bearer ', '');
    }
}

function extractCredentials(request: express.Request): LocalCredentials {
    const password: string = request.body['password'];
    const email: string = request.body['email'];
    return new LocalCredentials(email, password);
}