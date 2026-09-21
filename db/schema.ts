import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const inventory = sqliteTable("inventory", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  type: text("type").notNull(), name: text("name").notNull(), location: text("location").notNull(),
  description: text("description").notNull().default(""), price: integer("price"),
  status: text("status").notNull().default("draft"), imageKey: text("image_key"),
  createdAt: text("created_at").notNull(), updatedAt: text("updated_at").notNull(),
}, (table) => [index("idx_inventory_type_status").on(table.type, table.status)]);
