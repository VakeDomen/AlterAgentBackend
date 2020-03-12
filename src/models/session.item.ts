import { DbItem } from './db.item';

export class Session extends DbItem {

    user_id: string;
    client_id: string;
    service_id: string;
    description: string;

    constructor(data: any) {
        super(data);
        this.service_id   = data.service_id;
        this.client_id  = data.client_id;    
        this.user_id  = data.user_id;    
        this.description = data.description
    }
}