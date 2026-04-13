-- Create a small script to enter 3 real pieces of data
USE posts;

INSERT INTO posts (
    id, image_url, description, tags,
    likes_count, comments_count,
    is_liked, is_saved, author_id, created_at
) VALUES
(1, 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=500&fit=crop',
 'Beautiful ocean sunset', '["H2O","Sunset"]',
 2800, 42, FALSE, TRUE, 1, '2024-01-15'),

(2, 'https://images.unsplash.com/photo-1607153333879-c174d265f1d2?w=600&h=500&fit=crop',
 'Friendly dolphin', '["Water","Dolphin"]',
 1400, 28, TRUE, FALSE, 1, '2024-01-14'),

(3, 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=600&h=500&fit=crop',
 'Ocean blues', '["Ocean","Blue"]',
 10100, 156, FALSE, FALSE, 2, '2024-01-13'),

(4, 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=500&fit=crop',
 'Wave close up', '["H2O","repost"]',
 3500, 67, FALSE, FALSE, 0, '2024-01-12'),

(5, 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=600&h=500&fit=crop',
 'Sunset at sea', '["H2O","Sunset"]',
 2800, 39, FALSE, FALSE, 3, '2024-01-11'),

(6, 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=600&h=500&fit=crop',
 'Dolphin jumping', '["Dolph","jumps"]',
 1400, 21, FALSE, FALSE, 4, '2024-01-10');