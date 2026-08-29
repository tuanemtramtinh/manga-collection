CREATE TABLE "purchase_batches" (
	"id" serial PRIMARY KEY NOT NULL,
	"book_id" integer NOT NULL,
	"purchase_date" date NOT NULL,
	"total_price" integer NOT NULL,
	"note" text
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"password_hash" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "wishlist" ALTER COLUMN "book_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "books" ADD COLUMN "user_id" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "books" ADD COLUMN "slug" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "volumes" ADD COLUMN "edition" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "volumes" ADD COLUMN "purchase_batch_id" integer;--> statement-breakpoint
ALTER TABLE "wishlist" ADD COLUMN "user_id" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "wishlist" ADD COLUMN "book_title" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "purchase_batches" ADD CONSTRAINT "purchase_batches_book_id_books_id_fk" FOREIGN KEY ("book_id") REFERENCES "public"."books"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "books" ADD CONSTRAINT "books_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wishlist" ADD CONSTRAINT "wishlist_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;