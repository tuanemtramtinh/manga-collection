CREATE TABLE "books" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"author" text DEFAULT '' NOT NULL,
	"total_volumes" integer DEFAULT 0 NOT NULL,
	"owned_volumes" integer DEFAULT 0 NOT NULL,
	"status" text DEFAULT 'ongoing' NOT NULL,
	"color" text DEFAULT '#2563eb' NOT NULL,
	"has_goods" boolean DEFAULT false NOT NULL,
	"goods_count" integer DEFAULT 0 NOT NULL,
	"cover_url" text,
	"notes" text
);
--> statement-breakpoint
CREATE TABLE "goods" (
	"id" serial PRIMARY KEY NOT NULL,
	"book_id" integer NOT NULL,
	"name" text NOT NULL,
	"type" text DEFAULT '' NOT NULL,
	"image_url" text,
	"purchase_date" date,
	"price" integer
);
--> statement-breakpoint
CREATE TABLE "volumes" (
	"id" serial PRIMARY KEY NOT NULL,
	"book_id" integer NOT NULL,
	"volume_number" integer NOT NULL,
	"cover_url" text,
	"purchase_date" date,
	"price" integer
);
--> statement-breakpoint
ALTER TABLE "goods" ADD CONSTRAINT "goods_book_id_books_id_fk" FOREIGN KEY ("book_id") REFERENCES "public"."books"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "volumes" ADD CONSTRAINT "volumes_book_id_books_id_fk" FOREIGN KEY ("book_id") REFERENCES "public"."books"("id") ON DELETE cascade ON UPDATE no action;