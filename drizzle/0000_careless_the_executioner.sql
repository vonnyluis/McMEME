CREATE TABLE `rooms` (
	`id` text PRIMARY KEY NOT NULL,
	`host_hash` text NOT NULL,
	`guest_hash` text,
	`invite_hash` text,
	`a` text NOT NULL,
	`b` text NOT NULL,
	`template` text DEFAULT 'duo' NOT NULL,
	`ready_a` integer DEFAULT 0 NOT NULL,
	`ready_b` integer DEFAULT 0 NOT NULL,
	`revision` integer DEFAULT 0 NOT NULL,
	`created_at` integer NOT NULL,
	`expires_at` integer NOT NULL
);
