CREATE TABLE "contacts" (
	"id_contact" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"subject" text NOT NULL,
	"message" text NOT NULL,
	"status" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now()
);
