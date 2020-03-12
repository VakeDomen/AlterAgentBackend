import { DbItem } from './db.item';

export class Service extends DbItem {

    name: string;
    color: string;

    constructor(data: any) {
        super(data);
        this.name   = data.name;
        this.color  = data.color;    
    }
}