import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { query } from "@/lib/db";
import { ensureCurrentUser } from "@/lib/current-user";

// POST /api/posts/[id]/like - like a post
export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id: postId } = await context.params;
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await ensureCurrentUser(session.user);
    const userId = user.user_id;

    await query(
      "INSERT IGNORE INTO likes (user_id, post_id) VALUES (?, ?)",
      [userId, postId]
    );

    const [countRows]: any = await query(
      "SELECT COUNT(*) as count FROM likes WHERE post_id = ?",
      [postId]
    );

    return NextResponse.json({ liked: true, likesCount: Number(countRows[0].count) });
  } catch (error) {
    console.error("Like error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// DELETE /api/posts/[id]/like - unlike a post
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id: postId } = await context.params;
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await ensureCurrentUser(session.user);
    const userId = user.user_id;

    await query(
      "DELETE FROM likes WHERE user_id = ? AND post_id = ?",
      [userId, postId]
    );

    const [countRows]: any = await query(
      "SELECT COUNT(*) as count FROM likes WHERE post_id = ?",
      [postId]
    );

    return NextResponse.json({ liked: false, likesCount: Number(countRows[0].count) });
  } catch (error) {
    console.error("Unlike error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
