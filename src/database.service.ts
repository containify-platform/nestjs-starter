import { Injectable, type OnModuleDestroy } from "@nestjs/common";
import pg from "pg";

/** The Postgres pool. DATABASE_URL comes from the Postgres app: {{ "Postgres".DATABASE_URL }}. */
@Injectable()
export class DatabaseService implements OnModuleDestroy {
	readonly pool = createPool();

	query<T extends pg.QueryResultRow>(text: string, values?: unknown[]) {
		return this.pool.query<T>(text, values);
	}

	async onModuleDestroy() {
		await this.pool.end();
	}
}

export function createPool() {
	return new pg.Pool({
		connectionString: process.env.DATABASE_URL ?? "postgres://postgres:postgres@localhost:5432/app",
		max: 10,
	});
}
