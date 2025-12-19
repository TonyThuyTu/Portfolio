import {
  pgTable,
  serial,
  text,
  timestamp,
  integer,
} from "drizzle-orm/pg-core";

export const contacts = pgTable("contacts", {
  id_contact: serial("id_contact").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  subject: text("subject").notNull(),
  message: text("message").notNull(),

  status: integer("status").default(0),

  createdAt: timestamp("created_at").defaultNow(),
});

