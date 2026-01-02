import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

export const updateMessageStatus = async (
    messageId: string,
    status: string
) => {
    await pool.query(
        "UPDATE messages SET status = $1 WHERE id = $2",
        [status, messageId]
    );
}