const sqlite = require("sqlite");
import { DbItem } from '../models/db.item';
import * as config from './config.json';

const dbConnection: Promise<any> = sqlite.open(process.env.SQLITE_DB || './src/db/data/sqlite.db', { Promise });

export async function query<T>(query: string): Promise<T[]> {
    const db = await dbConnection;
    if (config.db.log) {
        console.log(query);
    }
    return db.all(query);
}

export async function fetch<T>(table: string, filter: DbItem): Promise<T[]> {
    return query<T>('SELECT * FROM ' + table + ' WHERE ' + filter.whereString());
}

export async function fetchAll<T>(table: string): Promise<T[]> {
    return query<T>('SELECT * FROM ' + table);
}

export async function fetchSimilar<T>(table: string, filter: DbItem): Promise<T[]> {
    return query<T>('SELECT * FROM ' + table + ' WHERE ' + filter.whereSimilarString());
}

export async function insert<T>(table: string, filter: DbItem): Promise<T[]> {
    return query<T>('INSERT INTO ' + table + ' (' + filter.listKeys() + ') VALUES (' + filter.listValues() + ')');
}

export async function update<T>(table: string, filter: DbItem): Promise<T[]> {
    return query<T>('UPDATE ' + table + ' SET ' + filter.valuesToString() + ' WHERE id=\'' + filter.id + '\'');
}

export async function deleteItem<T>(table: string, filter: DbItem): Promise<T[]> {
    return query<T>('DELETE FROM ' + table + ' WHERE ' + filter.whereString());
}

export async function innerJoin<T>(t1: string, t2: string, t1key: string, t2key: string, filter: DbItem): Promise<T[]> {
    return query<T>('SELECT * FROM ' + t1 + ' AS t1 INNER JOIN ' + t2 + ' as t2 ON t1.' + t1key + ' = t2.' + t2key + ' WHERE ' + filter.whereString() );
}

export async function leftJoin<T>(t1: string, t2: string, t1key: string, t2key: string, filter: DbItem): Promise<T[]> {
    return query<T>('SELECT * FROM ' + t1 + ' AS t1 LEFT JOIN ' + t2 + ' as t2 ON t1.' + t1key + ' = t2.' + t2key + ' WHERE ' + filter.whereString());
}