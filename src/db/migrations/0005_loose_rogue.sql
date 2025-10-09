CREATE TABLE "public_task_link_table" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"task_id" integer NOT NULL,
	"token" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"expiresAt" timestamp NOT NULL,
	CONSTRAINT "public_task_link_table_token_unique" UNIQUE("token")
);
--> statement-breakpoint
ALTER TABLE "public_task_link_table" ADD CONSTRAINT "public_task_link_table_user_id_users_table_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users_table"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "public_task_link_table" ADD CONSTRAINT "public_task_link_table_task_id_task_table_task_id_fk" FOREIGN KEY ("task_id") REFERENCES "public"."task_table"("task_id") ON DELETE cascade ON UPDATE no action;