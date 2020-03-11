import { DbItem } from './db.item';

export class Client extends DbItem {

    name: string;
    email: string;
    phone: string;
    address: string;
    description: string;

    constructor(data: any) {
        super(data);
        this.name           = data.name;
        this.email          = data.email;
        this.phone          = data.phone;
        this.address        = data.address;
        this.description    = data.description;
    }
}