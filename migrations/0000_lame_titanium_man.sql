CREATE TABLE "audit_logs" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "audit_logs_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"user_id" text NOT NULL,
	"action" text NOT NULL,
	"resource" text NOT NULL,
	"resource_id" text,
	"details" jsonb DEFAULT '{}'::jsonb,
	"ip_address" text,
	"user_agent" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "contact_submissions" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "contact_submissions_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text,
	"company" text,
	"message" text NOT NULL,
	"status" text DEFAULT 'new',
	"assigned_to" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "crm_integrations" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "crm_integrations_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"user_id" text NOT NULL,
	"type" text NOT NULL,
	"name" text NOT NULL,
	"api_key" text,
	"access_token" text,
	"refresh_token" text,
	"webhook_url" text,
	"config" jsonb DEFAULT '{}'::jsonb,
	"is_active" boolean DEFAULT true,
	"last_sync" timestamp,
	"token_expiry" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "kpi_metrics" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "kpi_metrics_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"user_id" text NOT NULL,
	"integration_id" integer NOT NULL,
	"metric_type" text NOT NULL,
	"value" numeric(10, 2) NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"timestamp" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "order_items" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "order_items_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"order_id" integer NOT NULL,
	"package_id" integer NOT NULL,
	"quantity" integer NOT NULL,
	"price" numeric(10, 2) NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "orders" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "orders_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"user_id" text NOT NULL,
	"total" numeric(10, 2) NOT NULL,
	"status" text NOT NULL,
	"stripe_payment_intent_id" text,
	"assigned_by" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "packages" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "packages_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" text NOT NULL,
	"price" text NOT NULL,
	"description" text,
	"features" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "public_users" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"email" varchar NOT NULL,
	"password_hash" varchar,
	"provider" varchar DEFAULT 'local',
	"provider_id" varchar,
	"social_accounts" jsonb DEFAULT '[]'::jsonb,
	"privileges" jsonb,
	"role" varchar DEFAULT 'user',
	"permissions" jsonb DEFAULT '{}'::jsonb,
	"is_active" boolean DEFAULT true,
	"last_login" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "public_users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"sid" varchar PRIMARY KEY NOT NULL,
	"sess" jsonb NOT NULL,
	"expire" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "support_tickets" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "support_tickets_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"user_id" text NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"priority" text DEFAULT 'medium',
	"status" text DEFAULT 'open',
	"assigned_to" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "users_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" text NOT NULL,
	"email" text NOT NULL,
	"password" text NOT NULL,
	"role" text DEFAULT 'user',
	"is_active" boolean DEFAULT true,
	"permissions" jsonb DEFAULT '{}'::jsonb,
	"last_login" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE INDEX "IDX_session_expire" ON "sessions" USING btree ("expire");