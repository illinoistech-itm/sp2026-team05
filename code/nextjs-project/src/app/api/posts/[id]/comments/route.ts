import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { query } from "@/lib/db";

// GET /api/posts/[id]/comments - get comments for a post
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [rows]: any = await query(
      `SELECT 
        c.comment_id as id,
        c.content as text,
        c.created_at,
        u.username,
        u.profile_pic_url as avatar
       FROM comments c
       INNER JOIN users u ON c.user_id = u.user_id
       WHERE c.post_id = ?
       ORDER BY c.created_at ASC`,
      [params.id]
    );

    const comments = rows.map((row: any) => ({
      id: row.id.toString(),
      text: row.text,
      createdAt: row.created_at,
      author: {
        id: row.user_id,
        username: row.username,
        avatar: row.avatar,
      },
    }));

    return NextResponse.json({ comments });
  } catch (error) {
    console.error("Fetch comments error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// POST /api/posts/[id]/comments - add a comment
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { text } = body;

    if (!text?.trim()) {
      return NextResponse.json({ error: "Comment cannot be empty" }, { status: 400 });
    }

    const userEmail = session.user.email ?? "";

    const [userRows]: any = await query(
      "SELECT user_id, username, profile_pic_url FROM users WHERE email = ?",
      [userEmail]
    );
    if (userRows.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const user = userRows[0];

    const [result]: any = await query(
      "INSERT INTO comments (post_id, user_id, content) VALUES (?, ?, ?)",
      [params.id, user.user_id, text.trim()]
    );

    return NextResponse.json({
      comment: {
        id: result.insertId.toString(),
        text: text.trim(),
        createdAt: new Date().toISOString(),
        author: {
          id: user.user_id.toString(),
          username: user.username,
          avatar: user.profile_pic_url,
        },
      },
    });
  } catch (error) {
    console.error("Add comment error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
