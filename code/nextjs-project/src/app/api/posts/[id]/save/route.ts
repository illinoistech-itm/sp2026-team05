import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { query } from "@/lib/db";
import { ensureCurrentUser } from "@/lib/current-user";

// POST /api/posts/[id]/save - save a post
export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await ensureCurrentUser(session.user);

    await query(
      "INSERT IGNORE INTO saved_posts (user_id, post_id) VALUES (?, ?)",
      [user.user_id, id]
    );

    return NextResponse.json({ saved: true });
  } catch (error) {
    console.error("Save error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// DELETE /api/posts/[id]/save - unsave a post
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await ensureCurrentUser(session.user);

    await query(
      "DELETE FROM saved_posts WHERE user_id = ? AND post_id = ?",
      [user.user_id, id]
    );

    return NextResponse.json({ saved: false });
  } catch (error) {
    console.error("Unsave error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
