-- Creates a small table with three values

USE posts;

CREATE TABLE comment 
(
ID INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
PosterName VARCHAR(32),
Title VARCHAR(32),
Content VARCHAR(500)
);

CREATE TABLE posts (
    id INT PRIMARY KEY,
    image_url TEXT NOT NULL,
    description TEXT,
    tags JSON,
    likes_count INT DEFAULT 0,
    comments_count INT DEFAULT 0,
    is_liked BOOLEAN DEFAULT FALSE,
    is_saved BOOLEAN DEFAULT FALSE,
    author_id INT,
    created_at DATE
);