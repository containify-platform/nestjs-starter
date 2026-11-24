# NestJS API starter

A small [NestJS](https://nestjs.com) API on Node.js 24 with a Postgres database, ready to deploy on [Containify](https://containify.cloud).

- `GET /` says hello and lists the routes
- `GET /health` answers `ok` (the health check)
- `GET /notes` and `POST /notes` (`{"body": "..."}`) read and write the `notes` table, through a `DatabaseService` wrapping a [node-postgres](https://node-postgres.com) pool
- `src/migrate.ts` applies `migrations/*.sql` in order, once each

## Run locally

You need Node.js 22 or newer and a Postgres database.

```bash
npm install
export DATABASE_URL=postgres://postgres:postgres@localhost:5432/app
npm run build && npm run migrate
npm run dev
```

Then open http://localhost:3000.

## Deploy on Containify

Deploy the **NestJS API starter** template from the catalogue (`containify templates deploy nestjs`). It builds this repository with its Dockerfile and adds:

- **API**: this app, on a public HTTPS endpoint, with `/health` as its health check. Its pre-deploy command, `node dist/migrate.js`, runs the migrations before each release takes traffic.
- **Postgres**: Postgres 17 on a volume, reachable only over the private network. The API's `DATABASE_URL` references it.

To make it yours, fork this repository, then point the API app's source at your fork.

## Notes

- Containify sets `HOST=::` on every app; `main.ts` listens there (IPv6 and IPv4). The template sets `PORT=3000`.
- `trust proxy` is set to one hop, so `req.ip` and `req.protocol` reflect the visitor behind Containify's HTTPS edge.
- Shutdown hooks are on: on `SIGTERM` Nest stops the server and closes the database pool, so deploys don't cut requests off.
- Add a migration by dropping a new file into `migrations/`, e.g. `0002_add_tags.sql`. Names sort in the order they run. If you'd rather use an ORM (TypeORM, Prisma, Drizzle, MikroORM), swap the pre-deploy command for its migrate command.

## License

MIT
