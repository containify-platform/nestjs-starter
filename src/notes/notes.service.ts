import { Injectable } from "@nestjs/common";
import { DatabaseService } from "../database.service.js";

export interface Note {
	id: string;
	body: string;
	created_at: Date;
}

@Injectable()
export class NotesService {
	constructor(private readonly db: DatabaseService) {}

	async list(): Promise<Note[]> {
		const { rows } = await this.db.query<Note>("select id, body, created_at from notes order by id desc limit 50");
		return rows;
	}

	async create(body: string): Promise<Note> {
		const { rows } = await this.db.query<Note>("insert into notes (body) values ($1) returning id, body, created_at", [body]);
		return rows[0]!;
	}
}
