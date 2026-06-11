CREATE TABLE `users` (

  `id` integer PRIMARY KEY AUTO_INCREMENT,

  `username` varchar(100) UNIQUE NOT NULL,

  `email` varchar(255) UNIQUE NOT NULL,

  `password` varchar(255) NOT NULL,

  `first_name` varchar(100) NOT NULL,

  `last_name` varchar(100) NOT NULL,

  `created_at` timestamp NOT NULL DEFAULT (CURRENT_TIMESTAMP),

  `updated_at` timestamp NOT NULL DEFAULT (CURRENT_TIMESTAMP),

  `deleted_at` timestamp

);
 
CREATE TABLE `posts` (

  `id` integer PRIMARY KEY AUTO_INCREMENT,

  `user_id` integer NOT NULL,

  `content` text NOT NULL COMMENT 'Content of the post',

  `image_path` varchar(255),

  `created_at` timestamp NOT NULL DEFAULT (CURRENT_TIMESTAMP),

  `updated_at` timestamp NOT NULL DEFAULT (CURRENT_TIMESTAMP),

  `deleted_at` timestamp

);
 
CREATE TABLE `likes` (

  `id` integer PRIMARY KEY AUTO_INCREMENT,

  `user_id` integer NOT NULL,

  `post_id` integer NOT NULL,

  `created_at` timestamp NOT NULL DEFAULT (CURRENT_TIMESTAMP)

);
 
CREATE TABLE `comments` (

  `id` integer PRIMARY KEY AUTO_INCREMENT,

  `post_id` integer NOT NULL,

  `user_id` integer NOT NULL,

  `content` text NOT NULL,

  `created_at` timestamp NOT NULL DEFAULT (CURRENT_TIMESTAMP),

  `updated_at` timestamp NOT NULL DEFAULT (CURRENT_TIMESTAMP),

  `deleted_at` timestamp

);
 
CREATE UNIQUE INDEX `likes_index_0` ON `likes` (`user_id`, `post_id`);
 
ALTER TABLE `posts` ADD CONSTRAINT `user_posts` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);
 
ALTER TABLE `comments` ADD CONSTRAINT `comments_post` FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`) ON DELETE CASCADE;
 
ALTER TABLE `comments` ADD CONSTRAINT `comments_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);
 
ALTER TABLE `likes` ADD CONSTRAINT `likes_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
 
ALTER TABLE `likes` ADD CONSTRAINT `likes_post` FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`) ON DELETE CASCADE;