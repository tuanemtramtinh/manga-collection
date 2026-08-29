CREATE TABLE "purchase_batches" (
	"id" serial PRIMARY KEY NOT NULL,
	"book_id" integer NOT NULL,
	"purchase_date" date NOT NULL,
	"total_price" integer NOT NULL,
	"note" text
);
--> statement-breakpoint
ALTER TABLE "volumes" ADD COLUMN "purchase_batch_id" integer;
--> statement-breakpoint
ALTER TABLE "purchase_batches" ADD CONSTRAINT "purchase_batches_book_id_books_id_fk" FOREIGN KEY ("book_id") REFERENCES "public"."books"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "volumes" ADD CONSTRAINT "volumes_purchase_batch_id_purchase_batches_id_fk" FOREIGN KEY ("purchase_batch_id") REFERENCES "public"."purchase_batches"("id") ON DELETE set null ON UPDATE no action;
