import { DbItem } from './db.item';
import * as config from '../db/config.json';
import * as bcrypt from 'bcrypt';

export class User extends DbItem {

    name: string;
    email: string;
    password: string;
    role: 'USER' | 'ADMIN' = 'USER';

    constructor(data: any) {
        super(data);
        this.name       = data.name;
        this.email      = data.email;
        this.password   = data.password;
        if (process.env.ADMIN_EMAIL === data.email) {
            this.role = 'ADMIN';
        }
    }

    isValid(): boolean {
        if (!(this.name && this.email && this.password && this.role)) {
            return false;
        }
        if (this.role === 'ADMIN' && this.email !== process.env.ADMIN_EMAIL) {
            return false;
        }
        return true;
    }

    async hashPassword(): Promise<void> {
        this.password = await bcrypt.hash(this.password, +(process.env.HASH_SALT_ROUNDS || 10));
    }

    async isPasswordSame(password: string): Promise<boolean> {
        return this.password === await bcrypt.hash(password, +(process.env.HASH_SALT_ROUNDS || 10));
    }
}