CREATE TABLE "accounts" (
	"id" text PRIMARY KEY,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" text PRIMARY KEY,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL UNIQUE,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY,
	"name" text NOT NULL,
	"email" text NOT NULL UNIQUE,
	"email_verified" boolean DEFAULT false NOT NULL,
	"image" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"username" text UNIQUE,
	"display_username" text,
	"description" text,
	"timezone" text DEFAULT 'America/Toronto' NOT NULL,
	"default_duration_minutes" integer DEFAULT 30 NOT NULL,
	"buffer_minutes" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "verifications" (
	"id" text PRIMARY KEY,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "availabilities" (
	"id" text PRIMARY KEY,
	"owner_id" text NOT NULL,
	"day_of_week" integer NOT NULL,
	"start_minute" integer NOT NULL,
	"end_minute" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "availabilities_owner_id_day_of_week_unique" UNIQUE("owner_id","day_of_week"),
	CONSTRAINT "valid_day_of_week" CHECK ("day_of_week" BETWEEN 0 AND 6),
	CONSTRAINT "start_minute_before_end_minute" CHECK ("start_minute" < "end_minute")
);
--> statement-breakpoint
CREATE TABLE "bookings" (
	"id" text PRIMARY KEY,
	"owner_id" text NOT NULL,
	"slot_start_utc" timestamp(3) with time zone NOT NULL,
	"slot_end_utc" timestamp(3) with time zone NOT NULL,
	"booker_name" text NOT NULL,
	"booker_email" text NOT NULL,
	"note" text NOT NULL,
	"idempotency_key" text UNIQUE,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "bookings_owner_id_slot_start_utc_unique" UNIQUE("owner_id","slot_start_utc"),
	CONSTRAINT "slot_start_utc_before_slot_end_utc" CHECK ("slot_start_utc" < "slot_end_utc")
);
--> statement-breakpoint
CREATE INDEX "accounts_user_id_index" ON "accounts" ("user_id");--> statement-breakpoint
CREATE INDEX "sessions_user_id_index" ON "sessions" ("user_id");--> statement-breakpoint
CREATE INDEX "verifications_identifier_index" ON "verifications" ("identifier");--> statement-breakpoint
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "availabilities" ADD CONSTRAINT "availabilities_owner_id_users_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_owner_id_users_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE CASCADE;