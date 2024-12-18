// Importiere Drizzle-Module
import { pgTable, varchar, serial, timestamp, integer, foreignKey,unique, jsonb } from 'drizzle-orm/pg-core';

// PostgreSQL Schemas

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
    email: varchar('email', { length: 255 }).notNull(),
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

// Category Schema
export const category = pgTable("category", {
  id: serial("id").primaryKey().notNull(),
  name: varchar("name", { length: 30 }).notNull(),
  studyCount: integer("study_count").notNull().default(0),
  user_id: varchar("user_id").notNull().references(() => user.id),
}, (table) => {
  return {
      userIdNameUnique: unique().on(table.user_id, table.name)
  };
});

// Flashcard Schema
export const flashcard = pgTable("flashcard", {
  id: serial("id").primaryKey().notNull(),
  question: varchar("question", { length: 255 }).notNull(),
  answer: varchar("answer", { length: 255 }).notNull(),
  category_id: integer("category_id")
      .notNull()
      .references(() => category.id, { onDelete: "cascade" }), 
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
  num_correct: integer("num_correct").default(0),
  num_wrong: integer("num_wrong").default(0),
  user_id: varchar("user_id").notNull().references(() => user.id),
});


// learnSession Schema
export const learnSession = pgTable("learnSession",{
  id: serial('id').primaryKey().notNull(),
  category_id : integer("category_id").notNull().references(() => category.id, {onDelete:"cascade"}),
  date:timestamp("date").defaultNow(),
  data:jsonb("data").notNull(),
  total_correct: integer("total_correct").notNull(),
  total_wrong: integer("total_wrong").notNull(),
  user_id: varchar("user_id").notNull().references(() => user.id)
})

export const schema = { roles, user, category, flashcard,learnSession };

export type user = typeof user.$inferSelect
