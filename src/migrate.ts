import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import { createPool } from "./database.service.js";

// Applies migrations/*.sql in name order, each once, each in a transaction.
// Containify runs it before every deploy (the template's pre-deploy command).

const dir = join(import.meta.dirname, "../migrations");
const pool = createPool();
const client = await pool.connect();
try {
	await client.query("create table if not exists schema_migrations (name text primary key, applied_at timestamptz not null default now())");
	const { rows } = await client.query<{ name: string }>("select name from schema_migrations");
	const applied = new Set(rows.map((r) => r.name));

	for (const name of (await readdir(dir)).filter((f) => f.endsWith(".sql")).sort()) {
		if (applied.has(name)) continue;
		const text = await readFile(join(dir, name), "utf8");
		try {
			await client.query("begin");
			await client.query(text);
			await client.query("insert into schema_migrations (name) values ($1)", [name]);
			await client.query("commit");
		} catch (err) {
			await client.query("rollback");
			throw err;
		}
		console.log(`applied ${name}`);
	}
	console.log("migrations up to date");
} finally {
	client.release();
	await pool.end();
}
