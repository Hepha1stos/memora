import { pgTable, varchar, integer, serial, timestamp, foreignKey } from 'drizzle-orm/pg-core';

// Roles table
export const roles = pgTable('roles', {
  id: serial('id').primaryKey().notNull(),
  name: varchar('name', { length: 255 }).notNull().unique(),
});

// User table
export const user = pgTable('user', {
  id: varchar('id').primaryKey().notNull(),
  username: varchar('username', { length: 255 }).notNull().unique(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  email:varchar('email',{length:255}).notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  userAuthToken: varchar('user_auth_token', { length: 255 }).notNull().unique(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  roleId: integer('role_id').notNull(),
}, (table) => ({
  roleForeignKey: foreignKey({
    columns: [table.roleId],
    foreignColumns: [roles.id],
  }),
}));

export const schema = { user, roles };
export type user = typeof user.$inferSelect
