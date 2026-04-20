import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import db, { query } from "@/lib/db";

// GET /api/posts - get all posts for the feed
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userEmail = session.user.email ?? "";

    const [rows]: any = await query(
      `SELECT 
        p.post_id,
        p.image_url,
        p.caption,
        p.created_at,
        u.username as author_username,
        u.profile_pic_url as author_pic,
        u.user_id as author_id,
        (SELECT COUNT(*) FROM likes l WHERE l.post_id = p.post_id) as likes_count,
        (SELECT COUNT(*) FROM comments c WHERE c.post_id = p.post_id) as comments_count,
        EXISTS(
          SELECT 1 FROM likes l 
          INNER JOIN users lu ON l.user_id = lu.user_id 
          WHERE l.post_id = p.post_id AND lu.email = ?
        ) as is_liked,
        EXISTS(
          SELECT 1 FROM saved_posts sp 
          INNER JOIN users su ON sp.user_id = su.user_id 
          WHERE sp.post_id = p.post_id AND su.email = ?
        ) as is_saved,
       GROUP_CONCAT(h.tag_name ORDER BY h.tag_name SEPARATOR ',') as tags
       FROM posts p
       INNER JOIN users u ON p.user_id = u.user_id
       LEFT JOIN post_tags pt ON p.post_id = pt.post_id
       LEFT JOIN hashtags h ON pt.tag_id = h.tag_id
       GROUP BY
        p.post_id,
        p.image_url,
        p.caption,
        p.created_at,
        u.username,
        u.profile_pic_url,
        u.user_id
       ORDER BY p.created_at DESC`,
      [userEmail, userEmail]
    );

    // Format posts to match existing Post type
    const posts = rows.map((row: any) => ({
      id: row.post_id.toString(),
      imageUrl: row.image_url,
      description: row.caption,
      tags: row.tags ? row.tags.split(",") : [],
      likesCount: Number(row.likes_count),
      commentsCount: Number(row.comments_count),
      isLiked: Boolean(row.is_liked),
      isSaved: Boolean(row.is_saved),
      author: {
        id: row.author_id.toString(),
        username: row.author_username,
        avatar: row.author_pic,
      },
      createdAt: row.created_at,
    }));

    return NextResponse.json({ posts });
  } catch (error) {
    console.error("Fetch posts error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// POST /api/posts - create a new post
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { imageUrl, description, tags } = body;

    if (!imageUrl) {
      return NextResponse.json({ error: "Image URL is required" }, { status: 400 });
    }

    const userEmail = session.user.email ?? "";

    // Get user ID
    const [userRows]: any = await query(
      "SELECT user_id FROM users WHERE email = ?",
      [userEmail]
    );
    if (userRows.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    const userId = userRows[0].user_id;

    // Insert post
    const [result]: any = await query(
      "INSERT INTO posts (user_id, image_url, caption) VALUES (?, ?, ?)",
      [userId, imageUrl, description ?? ""]
    );
    const postId = result.insertId;

    // Handle tags
    if (tags && tags.length > 0) {
      for (const tagName of tags) {
        const cleanTag = tagName.replace(/^#/, "").trim().toLowerCase();
        if (!cleanTag) continue;

        // Insert tag if not exists
        await query(
          "INSERT IGNORE INTO hashtags (tag_name) VALUES (?)",
          [cleanTag]
        );

        // Get tag ID
        const [tagRows]: any = await query(
          "SELECT tag_id FROM hashtags WHERE tag_name = ?",
          [cleanTag]
        );

        if (tagRows.length > 0) {
          await query(
            "INSERT IGNORE INTO post_tags (post_id, tag_id) VALUES (?, ?)",
            [postId, tagRows[0].tag_id]
          );
        }
      }
    }

    return NextResponse.json({ success: true, postId });
  } catch (error) {
    console.error("Create post error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
