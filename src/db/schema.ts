import { pgTable, serial, text, timestamp, integer,boolean,pgEnum } from 'drizzle-orm/pg-core';

export const usersTable = pgTable('users_table', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  auth_id: text('auth_id').notNull(),
  createdAt: timestamp('createdAt').notNull(),
});

export type InsertUser = typeof usersTable.$inferInsert;
export type SelectUser = typeof usersTable.$inferSelect;

export const taskTable = pgTable('task_table', {
  task_id: serial('task_id').primaryKey(),
  userId: integer('user_id')
    .notNull()
    .references(() => usersTable.id, { onDelete: 'cascade' }), // foreign key
    title:text("task_title").notNull(),
    description:text("task_description").notNull(),
    isCompleted: boolean("is_completed").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),


  
});
export const accessEnum = pgEnum("access", ["read", "write"]);

export const sharedTaskTable = pgTable("shared_task_table", {
  share_id: serial("share_id").primaryKey(),
  taskId: integer("task_id")
    .notNull()
    .references(() => taskTable.task_id, { onDelete: "cascade" }),
  userId: integer("user_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  access: accessEnum("access").notNull().default("read"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const publicTaskLinkTable = pgTable('public_task_link_table', {
  public_id: serial('id').primaryKey(),
 userId: integer('user_id') //owner of task
    .notNull()
    .references(() => usersTable.id, { onDelete: 'cascade' }),
  taskId: integer('task_id') // task id from task_table
    .notNull()
    .references(() => taskTable.task_id, { onDelete: 'cascade' }),
  token: text('token').notNull().unique(), 
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  expiresAt: timestamp('expiresAt').notNull(), // set dynamically when inserting
});