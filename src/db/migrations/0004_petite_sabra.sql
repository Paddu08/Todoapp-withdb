CREATE TYPE "public"."access" AS ENUM('read', 'write');--> statement-breakpoint
CREATE TABLE "shared_task_table" (
	"share_id" serial PRIMARY KEY NOT NULL,
	"task_id" integer NOT NULL,
	"user_id" integer NOT NULL,
	"access" "access" DEFAULT 'read' NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "task_table" (
	"task_id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"task_title" text NOT NULL,
	"task_description" text NOT NULL,
	"is_completed" boolean DEFAULT false NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "shared_task_table" ADD CONSTRAINT "shared_task_table_task_id_task_table_task_id_fk" FOREIGN KEY ("task_id") REFERENCES "public"."task_table"("task_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shared_task_table" ADD CONSTRAINT "shared_task_table_user_id_users_table_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users_table"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "task_table" ADD CONSTRAINT "task_table_user_id_users_table_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users_table"("id") ON DELETE cascade ON UPDATE no action;