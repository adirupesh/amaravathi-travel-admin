CREATE TABLE `inventory` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`type` text NOT NULL,
	`name` text NOT NULL,
	`location` text NOT NULL,
	`description` text DEFAULT '' NOT NULL,
	`price` integer,
	`status` text DEFAULT 'draft' NOT NULL,
	`image_key` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_inventory_type_status` ON `inventory` (`type`,`status`);
