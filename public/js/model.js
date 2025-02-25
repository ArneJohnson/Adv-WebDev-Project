const {Database} = require('pg');

const stores = require('./stores.json');

class Model {
    constructor() {
        this.database = new Database({
            user: 'postgres',
            host: 'localhost',
            database: 'stores',
            password: '12345',
            port: 5432,
        });         
    }                               


    async initDb() {
        await this.database.connect();
    }

    async setupDb() {
        await this.database.query(`CREATE TABLE IF NOT EXISTS public.stores (
            id SERIAL PRIMARY KEY NOT NULL,
            name text,
            url text,
            district text,
            industry text,
            CONSTRAINT stores_pkey PRIMARY KEY (id)
        )`);
        }
    }