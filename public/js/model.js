const { Pool } = require('pg');
const stores = require('../../stores.json');
    
class ModelClass {
    constructor() {
        this.pool = new Pool({
            user: 'postgres',
            host: process.env.DB_HOST, //'127.0.0.1'
            database: process.env.DB_NAME, //'stores'
            password: process.env.DB_PASSWORD,//'12345'
            port: process.env.DB_PORT, //5432
        });         
    }

    async initDb() {
        await this.pool.connect();
    }

    async setupDb() {
        await this.pool.query(`CREATE TABLE IF NOT EXISTS public.stores (
            id SERIAL PRIMARY KEY,  -- single primary key
            name text,
            url text,
            district text,
            industry text
        )`);
    
        for (const store of stores) {
            const { rows } = await this.pool.query(`SELECT * FROM public.stores WHERE name = $1`, [store.name]);
            if (rows.length === 0) {
                await this.pool.query(`INSERT INTO public.stores (name, url, district, industry) VALUES ($1, $2, $3, $4)`,
                    [store.name, store.url, store.district, store.industry]);
            }
        }
    }

    async getAllStores() {
        const res = await this.pool.query('SELECT * FROM public.stores ORDER BY name');
        return res.rows;
    }    

    async getStoreById(storeId) {
        const { rows } = await this.pool.query(`SELECT * FROM public.stores WHERE id = $1`, [storeId]);
        return rows[0] && rows[0].id;
    }

    async deleteStore(storeId) {
        await this.pool.query(`DELETE FROM public.stores WHERE id = $1`, [storeId]);
    }

    async updateStore(updatedStore) {
        const { id, name, url, district, industry } = updatedStore;
        const values = [name, url, district, industry, id];

        await this.pool.query(`UPDATE public.stores SET name = $1, url = $2, district = $3, industry = $4 WHERE id = $5`, values);
    }

    async addStore(addStore) {
        const { name, url, district, industry } = addStore;
        const values = [name, url, district, industry];

        await this.pool.query(`INSERT INTO public.stores (name, url, district, industry) VALUES ($1, $2, $3, $4)`, values);
    }
}

module.exports = ModelClass;