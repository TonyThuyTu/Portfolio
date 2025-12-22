import {
  pgTable,
  serial,
  text,
  timestamp,
  integer,
  varchar,
  jsonb,
  index,
  date,
} from "drizzle-orm/pg-core";

/* ======================
   CONTACTS
====================== */

export const contacts = pgTable("contacts", {
  id_contact: serial("id_contact").primaryKey(),

  name: text("name").notNull(),
  email: text("email").notNull(),
  subject: text("subject").notNull(),
  message: text("message").notNull(),

  status: integer("status").default(0),

  createdAt: timestamp("created_at")
    .defaultNow()
    .notNull(),
});

/* ======================
   PROJECTS
====================== */

export const projects = pgTable(
  "projects",
  {
    id_project: serial("id_project").primaryKey(),

    name: varchar("name", { length: 255 }).notNull(),
    slug: varchar("slug", { length: 255 }).notNull().unique(),

    img_cover: varchar("img_cover", { length: 500 }).notNull(),

    short_desc: varchar("short_desc", { length: 1000 }).notNull(),
    long_desc: text("long_desc").notNull(),
    
    start_date: date('start_date').notNull(),
    end_date: date('end_date'),

    images: jsonb("images")
      .$type<string[]>()
      .notNull()
      .default([]),

    tech_stack: jsonb("tech_stack")
      .$type<string[]>()
      .notNull()
      .default([]),

    source: varchar('source', { length: 500 }).notNull(),

    createdAt: timestamp("created_at")
      .defaultNow()
      .notNull(),

  },
  (table) => ({
    slugIdx: index("projects_slug_idx").on(table.slug),
  })
);

