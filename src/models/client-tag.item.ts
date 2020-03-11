import { DbItem } from './db.item';

export class ClientTag extends DbItem {

    client_id: string;
    tag_id: string;

    constructor(data: any) {
        super(data);
        this.client_id  = data.client_id;
        this.tag_id     = data.tag_id;    
    }
}