import { Controller, Get, Header } from "@nestjs/common";

@Controller()
export class AppController {
	@Get()
	hello() {
		return {
			name: "nestjs-starter",
			message: "Hello from NestJS on Containify",
			routes: ["GET /health", "GET /notes", "POST /notes"],
		};
	}

	/** The health check: answers as long as the server is up. */
	@Get("health")
	@Header("Content-Type", "text/plain")
	health() {
		return "ok";
	}
}
