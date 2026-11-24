create table notes (
	id bigserial primary key,
	body text not null,
	created_at timestamptz not null default now()
);
