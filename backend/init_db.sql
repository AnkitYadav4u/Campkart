-- =============================
-- CamKart Database Initialization
-- =============================
-- Database: my_project

-- Drop tables if they exist
DROP TABLE IF EXISTS `ad_images`;
DROP TABLE IF EXISTS `ads`;
DROP TABLE IF EXISTS `users`;

-- =============================
-- Table: users
-- =============================
CREATE TABLE `users` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(100) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =============================
-- Table: ads
-- =============================
CREATE TABLE `ads` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(255) NOT NULL,
  `description` TEXT NOT NULL,
  `price` DECIMAL(10,2) NOT NULL,
  `user_email` VARCHAR(100) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`user_email`) REFERENCES `users`(`email`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =============================
-- Table: ad_images
-- =============================
CREATE TABLE `ad_images` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `ad_id` INT UNSIGNED NOT NULL,
  `image_path` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`ad_id`) REFERENCES `ads`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =============================
-- Sample User (Optional)
-- =============================
INSERT INTO `users` (`name`, `email`, `password`) VALUES
('Ankit Yadav', 'ayadav@gmail.com', '$2y$10$examplehashedpassword');

-- =============================
-- Sample Ad (Optional)
-- =============================
INSERT INTO `ads` (`title`, `description`, `price`, `user_email`) VALUES
('Sample Ad', 'This is a sample ad description', 1000, 'ayadav@gmail.com');

-- Sample image (Optional)
INSERT INTO `ad_images` (`ad_id`, `image_path`) VALUES
(1, 'uploads/sample.jpg');

