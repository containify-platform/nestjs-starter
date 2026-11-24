import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module.js";

const app = await NestFactory.create(AppModule);

// HTTPS ends at Containify's edge, which forwards requests with X-Forwarded-For
// and X-Forwarded-Proto. Trust that one hop.
app.getHttpAdapter().getInstance().set("trust proxy", 1);

// A deploy stops the old replica with SIGTERM: Nest closes the server and
// runs onModuleDestroy hooks (the database pool) before exiting.
app.enableShutdownHooks();

// Containify sets HOST=:: (IPv6 and IPv4). PORT is set by the template.
const host = process.env.HOST ?? "::";
const port = Number(process.env.PORT ?? 3000);
await app.listen(port, host);
console.log(`Listening on [${host}]:${port}`);
