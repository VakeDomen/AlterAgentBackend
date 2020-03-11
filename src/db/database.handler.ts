const sqlite = require("sqlite");
import { DbItem } from '../models/db.item';
import * as config from './config.json';
import { fileURLToPath } from 'url';
import { Z_FILTERED } from 'zlib';

const dbConnection: Promise<any> = sqlite.open(process.env.SQLITE_DB || './db/sqlite.db', { Promise });

export async function query(query: string): Promise<DbItem[]> {
    const db = await dbConnection;
    if (config.db.log) {
        console.log(query);
    }
    return db.all(query);
}

export async function fetch(table: string, filter: DbItem): Promise<DbItem[]> {
    return query('SELECT * FROM ' + table + ' WHERE ' + filter.whereString());
}

export async function fetchAll(table: string): Promise<DbItem[]> {
    return query('SELECT * FROM ' + table);
}

export async function insert(table: string, filter: DbItem): Promise<DbItem[]> {
    return query('INSERT INTO ' + table + ' (' + filter.listKeys() + ') VALUES (' + filter.listValues() + ')');
}

export async function update(table: string, filter: DbItem): Promise<DbItem[]> {
    return query('UPDATE ' + table + ' SET ' + filter.valuesToString() + ' WHERE id=\'' + filter.id + '\'');
}

export async function deleteItem(table: string, filter: DbItem): Promise<DbItem[]> {
    return query('DELETE FROM ' + table + ' WHERE ' + filter.whereString());
}

export async function innerJoin(t1: string, t2: string, t1key: string, t2key: string, filter: DbItem): Promise<DbItem[]> {
    return query('SELECT * FROM ' + t1 + ' AS t1 INNER JOIN ' + t2 + ' as t2 ON t1.' + t1key + ' = t2.' + t2key );
}

export async function leftJoin(t1: string, t2: string, t1key: string, t2key: string, filter: DbItem): Promise<DbItem[]> {
    return query('SELECT * FROM ' + t1 + ' AS t1 LEFT JOIN ' + t2 + ' as t2 ON t1.' + t1key + ' = t2.' + t2key );
}