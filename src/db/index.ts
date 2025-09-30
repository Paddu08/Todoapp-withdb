import {drizzle} from "drizzle-orm/neon-http"
import { neon } from '@neondatabase/serverless';
import {config} from "dotenv"

config({path: ".env"})
console.log("Loaded DATABASE_URL:", process.env.DATABASE_URL);


const sql=neon(process.env.DATABASE_URL!)
const db=drizzle(sql)

export {db}