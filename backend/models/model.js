require('dotenv').config();
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

class ModelClass {
    constructor() {
        console.log('DB Config:');
        console.log('DB_PASSWORD:', process.env.DB_PASSWORD); 
        console.log("DB Host:", process.env.DB_HOST);
        console.log("DB Port:", process.env.DB_PORT);
        console.log("DB User:", process.env.DB_USER);
        console.log("DB Name:", process.env.DB_NAME);

        this.pool = new Pool({
            user: process.env.DB_USER,
            host: process.env.DB_HOST,
            database: process.env.DB_NAME,
            password: process.env.DB_PASSWORD,
            port: process.env.DB_PORT,
        });         
    }

    async initDb() {
        try {
            await this.pool.connect();
            console.log('Database connection successful');
        } catch (error) {
            console.error('Error connecting to the database:', error.stack);
        }
    }    

    async setupDb() {
        try {
            await this.pool.query(`
                CREATE TABLE IF NOT EXISTS public.stores (
                    id SERIAL PRIMARY KEY,
                    name TEXT NOT NULL,
                    url TEXT NOT NULL,
                    district TEXT NOT NULL,
                    industry TEXT NOT NULL
                )
            `);
            console.log('Table `stores` is ready');
        } catch (error) {
            console.error('Error creating table:', error.stack);
        }
    }

    async loadInitialStores() {
        const filePath = path.join(__dirname, '..', '..', 'stores.json');
        
        try {
            const data = fs.readFileSync(filePath, 'utf8');
            const stores = JSON.parse(data);
            
            for (const store of stores) {
                await this.addStore(store);
            }

            console.log('Initial stores data has been loaded into the database.');
        } catch (error) {
            console.error('Error loading initial stores:', error);
        }
    }

    async getAllStores() {
        try {
            const res = await this.pool.query('SELECT * FROM public.stores ORDER BY name');
            return res.rows;
        } catch (error) {
            console.error('Error fetching stores:', error);
            return [];
        }
    }

    async getStoreById(storeId) {
        try {
            const { rows } = await this.pool.query(`SELECT * FROM public.stores WHERE id = $1`, [storeId]);
            return rows.length > 0 ? rows[0] : null;
        } catch (error) {
            console.error('Error fetching store by ID:', error);
            return null;
        }
    }

    async deleteStore(storeId) {
        try {
            await this.pool.query(`DELETE FROM public.stores WHERE id = $1`, [storeId]);
            console.log(`Store with ID ${storeId} deleted.`);
        } catch (error) {
            console.error('Error deleting store:', error);
        }
    }

    async updateStore(updatedStore) {
        const { id, name, url, district, industry } = updatedStore;
        try {
            await this.pool.query(
                `UPDATE public.stores SET name = $1, url = $2, district = $3, industry = $4 WHERE id = $5`,
                [name, url, district, industry, id]
            );
            console.log(`Store with ID ${id} updated.`);
        } catch (error) {
            console.error('Error updating store:', error);
        }
    }

    async addStore(newStore) {
        const { name, url, district, industry } = newStore;
        try {
            await this.pool.query(
                `INSERT INTO public.stores (name, url, district, industry) VALUES ($1, $2, $3, $4)`,
                [name, url, district, industry]
            );
            console.log(`New store added: ${name}`);
        } catch (error) {
            console.error('Error adding store:', error);
        }
    }
}

module.exports = ModelClass;