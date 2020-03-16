import { DbItem } from './db.item';
import { threadId } from 'worker_threads';

export class Session extends DbItem {

    timestamp: string;
    client_id: string;
    service_id: string;
    description: string;

    constructor(data: any) {
        super(data);
        this.service_id     = data.service_id;
        this.timestamp      = data.timestamp
        this.client_id      = data.client_id;    
        this.description    = data.description
    }
}