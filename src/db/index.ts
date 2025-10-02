import {drizzle} from "drizzle-orm/neon-http"
import { neon } from '@neondatabase/serverless';
import {config} from "dotenv"
import * as schema from "./schema"; // 👈 important to bring in your tables

config({path: ".env"})
console.log("Loaded DATABASE_URL:", process.env.DATABASE_URL);


const sql=neon(process.env.DATABASE_URL!)


export const db = drizzle(sql, { schema });
