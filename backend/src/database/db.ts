import knex from 'knex';
import dotenv from 'dotenv';
dotenv.config();

export default knex({
    client: 'pg',
    connection: {
        host: String(process.env.SUPABASE_HOST),
        port: Number(process.env.SUPABASE_PORT),
        user: String(process.env.SUPABASE_USER),
        password: String(process.env.SUPABASE_PASSWORD),
        database: String(process.env.SUPABASE_DB),
        ssl: { rejectUnauthorized: false }
    },
    pool: { min: 0, max: 5 },
});