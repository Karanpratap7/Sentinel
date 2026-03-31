import { pool } from "../src/db/pool.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function migrate() {
    const client = await pool.connect();
    try {
        console.log("Starting migration...");
        const migrationFile = path.join(__dirname, "../src/db/migrations/001_init.sql");
        const sql = fs.readFileSync(migrationFile, "utf8");
        
        await client.query("BEGIN");
        await client.query(sql);
        await client.query("COMMIT");
        
        console.log("Migration completed successfully.");
    } catch (err) {
        await client.query("ROLLBACK");
        console.error("Migration failed:", err);
        process.exit(1);
    } finally {
        client.release();
        await pool.end();
    }
}

migrate();
