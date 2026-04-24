-- ============================================================
-- Photo League - MySQL Database Schema
-- Matches ERD from flowchart.md
-- ============================================================

CREATE DATABASE IF NOT EXISTS photo_league
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE photo_league;

-- ============================================================
-- USERS
-- ============================================================
CREATE TABLE users (
  user_id         INT           NOT NULL AUTO_INCREMENT,
  username        VARCHAR(50)   NOT NULL UNIQUE,
  email           VARCHAR(255)  NOT NULL UNIQUE,
  password_hash   VARCHAR(255)  NOT NULL COMMENT 'Stored securely (bcrypt/argon2)',
  profile_pic_url VARCHAR(500)  DEFAULT NULL,
  created_at      DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id),
  INDEX idx_users_email    (email),
  INDEX idx_users_username (username)
);

-- ============================================================
-- POSTS
-- ============================================================
CREATE TABLE posts (
  post_id    INT          NOT NULL AUTO_INCREMENT,
  user_id    INT          NOT NULL,
  image_url  VARCHAR(500) NOT NULL COMMENT 'Link to AWS/Cloud storage',
  caption    TEXT         DEFAULT NULL,
  created_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (post_id),
  INDEX idx_posts_user_id    (user_id),
  INDEX idx_posts_created_at (created_at),
  CONSTRAINT fk_posts_user
    FOREIGN KEY (user_id) REFERENCES users (user_id)
    ON DELETE CASCADE ON UPDATE CASCADE
);

-- ============================================================
-- COMMENTS
-- ============================================================
CREATE TABLE comments (
  comment_id INT      NOT NULL AUTO_INCREMENT,
  post_id    INT      NOT NULL,
  user_id    INT      NOT NULL,
  content    TEXT     NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (comment_id),
  INDEX idx_comments_post_id (post_id),
  INDEX idx_comments_user_id (user_id),
  CONSTRAINT fk_comments_post
    FOREIGN KEY (post_id) REFERENCES posts (post_id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_comments_user
    FOREIGN KEY (user_id) REFERENCES users (user_id)
    ON DELETE CASCADE ON UPDATE CASCADE
);

-- ============================================================
-- LIKES  (composite PK — one like per user per post)
-- ============================================================
CREATE TABLE likes (
  user_id    INT      NOT NULL,
  post_id    INT      NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, post_id),
  INDEX idx_likes_post_id (post_id),
  CONSTRAINT fk_likes_user
    FOREIGN KEY (user_id) REFERENCES users (user_id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_likes_post
    FOREIGN KEY (post_id) REFERENCES posts (post_id)
    ON DELETE CASCADE ON UPDATE CASCADE
);

-- ============================================================
-- FOLLOWS  (composite PK — one follow per pair)
-- ============================================================
CREATE TABLE follows (
  follower_id INT      NOT NULL COMMENT 'Who is following',
  followee_id INT      NOT NULL COMMENT 'Who is being followed',
  created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (follower_id, followee_id),
  INDEX idx_follows_followee_id (followee_id),
  CONSTRAINT fk_follows_follower
    FOREIGN KEY (follower_id) REFERENCES users (user_id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_follows_followee
    FOREIGN KEY (followee_id) REFERENCES users (user_id)
    ON DELETE CASCADE ON UPDATE CASCADE
);

-- ============================================================
-- SAVED_POSTS  (composite PK — one save per user per post)
-- ============================================================
CREATE TABLE saved_posts (
  user_id    INT      NOT NULL,
  post_id    INT      NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'When was it saved',
  PRIMARY KEY (user_id, post_id),
  INDEX idx_saved_posts_post_id (post_id),
  CONSTRAINT fk_saved_posts_user
    FOREIGN KEY (user_id) REFERENCES users (user_id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_saved_posts_post
    FOREIGN KEY (post_id) REFERENCES posts (post_id)
    ON DELETE CASCADE ON UPDATE CASCADE
);

-- ============================================================
-- HASHTAGS
-- ============================================================
CREATE TABLE hashtags (
  tag_id    INT          NOT NULL AUTO_INCREMENT,
  tag_name  VARCHAR(100) NOT NULL UNIQUE COMMENT 'Stored without # e.g. sunset, food',
  use_count INT          NOT NULL DEFAULT 0 COMMENT 'Cached count — kept in sync via triggers',
  PRIMARY KEY (tag_id),
  INDEX idx_hashtags_tag_name (tag_name)
);

-- ============================================================
-- POST_TAGS  (join table — many posts to many hashtags)
-- ============================================================
CREATE TABLE post_tags (
  post_id INT NOT NULL,
  tag_id  INT NOT NULL,
  PRIMARY KEY (post_id, tag_id),
  INDEX idx_post_tags_tag_id (tag_id),
  CONSTRAINT fk_post_tags_post
    FOREIGN KEY (post_id) REFERENCES posts (post_id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_post_tags_tag
    FOREIGN KEY (tag_id) REFERENCES hashtags (tag_id)
    ON DELETE CASCADE ON UPDATE CASCADE
);

-- ============================================================
-- MESSAGES
-- ============================================================
CREATE TABLE messages (
  message_id  INT       NOT NULL AUTO_INCREMENT,
  sender_id   INT       NOT NULL,
  receiver_id INT       NOT NULL,
  content     TEXT      NOT NULL,
  is_read     TINYINT(1) NOT NULL DEFAULT 0,
  created_at  DATETIME  NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (message_id),
  INDEX idx_messages_sender_id   (sender_id),
  INDEX idx_messages_receiver_id (receiver_id),
  INDEX idx_messages_created_at  (created_at),
  CONSTRAINT fk_messages_sender
    FOREIGN KEY (sender_id) REFERENCES users (user_id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_messages_receiver
    FOREIGN KEY (receiver_id) REFERENCES users (user_id)
    ON DELETE CASCADE ON UPDATE CASCADE
);

-- ============================================================
-- STORIES
-- ============================================================
CREATE TABLE stories (
  story_id   INT          NOT NULL AUTO_INCREMENT,
  user_id    INT          NOT NULL,
  image_url  VARCHAR(500) NOT NULL,
  created_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  expires_at DATETIME     NOT NULL,
  PRIMARY KEY (story_id),
  INDEX idx_stories_user_id    (user_id),
  INDEX idx_stories_expires_at (expires_at),
  CONSTRAINT fk_stories_user
    FOREIGN KEY (user_id) REFERENCES users (user_id)
    ON DELETE CASCADE ON UPDATE CASCADE
);

-- ============================================================
-- TRIGGERS — keep hashtags.use_count in sync with post_tags
-- ============================================================

DELIMITER $$

CREATE TRIGGER trg_post_tags_after_insert
AFTER INSERT ON post_tags
FOR EACH ROW
BEGIN
  UPDATE hashtags SET use_count = use_count + 1 WHERE tag_id = NEW.tag_id;
END$$

CREATE TRIGGER trg_post_tags_after_delete
AFTER DELETE ON post_tags
FOR EACH ROW
BEGIN
  UPDATE hashtags SET use_count = GREATEST(use_count - 1, 0) WHERE tag_id = OLD.tag_id;
END$$

DELIMITER ;

-- ============================================================
-- SAMPLE DATA
-- ============================================================

INSERT INTO users (username, email, password_hash, profile_pic_url) VALUES
  ('SimpleOcean24', 'SimpleOcean24@gmail.com', '$2b$12$placeholder_hash_1', NULL),
  ('DolphJoy',      'dolphjoy@gmail.com',       '$2b$12$placeholder_hash_2', NULL),
  ('Swim1',         'swim1@gmail.com',           '$2b$12$placeholder_hash_3', NULL),
  ('Voice36',       'voice36@gmail.com',         '$2b$12$placeholder_hash_4', NULL),
  ('Join10',        'join10@gmail.com',           '$2b$12$placeholder_hash_5', NULL);

INSERT INTO posts (user_id, image_url, caption) VALUES
  (1, 'https://system22h026.itm.iit.edu/hjuliano/pic4.jpg', 'Grey Streets'),
  (2, 'https://system22h026.itm.iit.edu/hjuliano/pic3.jpg', 'Blue Buildings'),
  (3, 'https://system22h026.itm.iit.edu/hjuliano/pic2.jpg', 'Car lights'),
  (4, 'https://system22h026.itm.iit.edu/hjuliano/pic1.jpg', 'Blooming flowers'),
  (5, 'https://system22h026.itm.iit.edu/hjuliano/pic0.jpg', 'Sunset snow'),
  (6, 'https://system22h026.itm.iit.edu/hjuliano/pic5.jpg', 'Japan crowd');

INSERT INTO hashtags (tag_name) VALUES
  ('city'), ('nature'), ('red'), ('street art'), ('building'), ('night life'), ('sky');

INSERT INTO post_tags (post_id, tag_id) VALUES
  (1, 1), (1, 4), (1, 5),
  (2, 1), (2, 5),
  (3, 1), (3, 6),
  (4, 2), (4, 7),
  (5, 2), (5, 7),
  (6, 1), (6, 3);

INSERT INTO follows (follower_id, followee_id) VALUES
  (1, 2), (1, 3), (1, 4), (1, 5),
  (2, 1), (3, 1), (4, 1), (5, 1);

INSERT INTO likes (user_id, post_id) VALUES
  (2, 1), (3, 1), (4, 1),
  (1, 2), (3, 2),
  (1, 3), (2, 3);

INSERT INTO saved_posts (user_id, post_id) VALUES
  (1, 2), (1, 3);

INSERT INTO messages (sender_id, receiver_id, content) VALUES
  (2, 1, 'Hi!!!'),
  (1, 2, 'Hello'),
  (3, 1, 'Nice photo!');
