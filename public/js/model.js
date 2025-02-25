const {Pool} = require('pg');

const stores = require('./stores.json');
    
    class ModelClass {
        constructor() {
            this.pool = new Pool({
                user: 'postgres',
                host: 'localhost',
                database: 'stores',
                password: '12345',
                port: 5432,
            });         
        }
    async initDb() {
        await this.pool.connect();
    }

    async setupDb() {
        await this.pool.query(`CREATE TABLE IF NOT EXISTS public.stores (
            id SERIAL PRIMARY KEY NOT NULL,
            name text,
            url text,
            district text,
            industry text,
            CONSTRAINT stores_pkey PRIMARY KEY (id)
        )`);
            await this.pool.query(`CREATE TABLE IF NOT EXISTS public.stores OWNER TO postgres`);
    
            for (const store of stores) {
                const {rows} = await this.pool.query(`SELECT * FROM public.stores WHERE name = '${store.name}'`);
                if (rows.length === 0) {
                    await this.pool.query(`INSERT INTO public.stores (name, url, district, industry) VALUES ('${store.name}', '${store.url}', '${store.district}', '${store.industry}')`);
            }
        }
    }

    async getAllStores(ORDER) {
        const res = await this.pool.query('SELECT * FROM public.stores ORDER BY ${ORDER}');
            return res.rows;
        }

    async getStoreById(storeId) {
        const {rows} = await this.pool.query(`SELECT * FROM public.stores WHERE id = ${storeId}`);
        return rows[0] && rows[0].id;
    }

    async deleteStore(storeId) {
        const {rows} = await this.pool.query(`DELETE FROM public.stores WHERE id = ${storeId}`);
    }
    async updateStore(updatedStore) {
        const {id, name, url, district, industry} = updatedStore;
        const values = [name, url, district, industry, id];

        const {rows} = await this.pool.query(`UPDATE public.stores SET name = $1, url = $2, district = $3, industry = $4 WHERE id = $5`, values);
    }

    async addStore(newStore) {
        const {name, url, district, industry} = newStore;
        const values = [name, url, district, industry];

        const {rows} = await this.pool.query(`INSERT INTO public.stores (name, url, district, industry) VALUES ($1, $2, $3, $4)`, values);
    }
}

module.exports = ModelClass;
