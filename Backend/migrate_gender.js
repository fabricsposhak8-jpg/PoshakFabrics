import { pool } from "./Server.js";

const result = await pool.query(
    `UPDATE products SET type_gender = 'female' WHERE type_gender IS NULL RETURNING id, name`
);

console.log(`✅ Updated ${result.rowCount} products to type_gender = 'female'`);
result.rows.forEach(r => console.log(`  - id:${r.id} "${r.name}"`));

process.exit(0);
