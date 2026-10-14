// Intentionally empty by default.
// Add Drizzle tables here when the site actually needs a database.
// See examples/d1/db/schema.ts for an opt-in example.
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
export const rooms = sqliteTable('rooms', {
  id: text('id').primaryKey(), hostHash: text('host_hash').notNull(), guestHash: text('guest_hash'), inviteHash: text('invite_hash'),
  a: text('a').notNull(), b: text('b').notNull(), template: text('template').notNull().default('duo'),
  readyA: integer('ready_a').notNull().default(0), readyB: integer('ready_b').notNull().default(0),
  revision: integer('revision').notNull().default(0), createdAt: integer('created_at').notNull(), expiresAt: integer('expires_at').notNull(),
});
