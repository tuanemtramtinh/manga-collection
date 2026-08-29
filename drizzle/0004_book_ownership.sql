ALTER TABLE "books" ADD COLUMN "user_id" integer;
--> statement-breakpoint
UPDATE "books" SET "user_id" = (SELECT MIN("id") FROM "users") WHERE "user_id" IS NULL;
--> statement-breakpoint
ALTER TABLE "books" ALTER COLUMN "user_id" SET NOT NULL;
--> statement-breakpoint
ALTER TABLE "books" ADD CONSTRAINT "books_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "wishlist" ADD COLUMN "user_id" integer;
--> statement-breakpoint
UPDATE "wishlist" SET "user_id" = (SELECT MIN("id") FROM "users") WHERE "user_id" IS NULL;
--> statement-breakpoint
ALTER TABLE "wishlist" ALTER COLUMN "user_id" SET NOT NULL;
--> statement-breakpoint
ALTER TABLE "wishlist" ADD CONSTRAINT "wishlist_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
