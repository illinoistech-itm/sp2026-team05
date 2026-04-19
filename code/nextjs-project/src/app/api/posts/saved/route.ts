import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import db from "@/lib/db";

// GET /api/posts/saved - get current user's saved posts
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [rows]: any = await db.execute(
      `SELECT p.post_id, p.image_url, p.caption, p.created_at,
        u.username as author_username, u.profile_pic_url as author_pic
       FROM saved_posts sp
       INNER JOIN posts p ON sp.post_id = p.post_id
       INNER JOIN users u ON p.user_id = u.user_id
       INNER JOIN users su ON sp.user_id = su.user_id
       WHERE su.email = ?
       ORDER BY sp.created_at DESC`,
      [session.user.email]
    );

    return NextResponse.json({ posts: rows });
  } catch (error) {
    console.error("Fetch saved posts error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
