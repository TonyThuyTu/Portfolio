ALTER TABLE "projects" DROP COLUMN "updated_at";--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_slug_unique" UNIQUE("slug");