import { Module } from "@nestjs/common";
import { AppController } from "./app.controller.js";
import { DatabaseService } from "./database.service.js";
import { NotesController } from "./notes/notes.controller.js";
import { NotesService } from "./notes/notes.service.js";

@Module({
	controllers: [AppController, NotesController],
	providers: [DatabaseService, NotesService],
})
export class AppModule {}
