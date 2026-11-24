import { BadRequestException, Body, Controller, Get, Post } from "@nestjs/common";
import { NotesService } from "./notes.service.js";

@Controller("notes")
export class NotesController {
	constructor(private readonly notes: NotesService) {}

	@Get()
	list() {
		return this.notes.list();
	}

	@Post()
	create(@Body() input: { body?: unknown }) {
		const body = typeof input?.body === "string" ? input.body.trim() : "";
		if (!body || body.length > 1000) throw new BadRequestException("body must be 1 to 1000 characters");
		return this.notes.create(body);
	}
}
