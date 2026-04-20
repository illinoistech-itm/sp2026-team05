import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import db from "@/lib/db";

// GET /api/posts/my-posts - get current user's posts
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userEmail = session.user.email ?? "";

    const [rows]: any = await db.execute(
      `SELECT p.post_id, p.image_url, p.caption, p.created_at,
        (SELECT COUNT(*) FROM likes l WHERE l.post_id = p.post_id) as likes_count,
        (SELECT COUNT(*) FROM comments c WHERE c.post_id = p.post_id) as comments_count
       FROM posts p
       INNER JOIN users u ON p.user_id = u.user_id
       WHERE u.email = ?
       ORDER BY p.created_at DESC`,
      [userEmail]
    );

    return NextResponse.json({ posts: rows });
  } catch (error) {
    console.error("Fetch posts error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
