import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { query } from "@/lib/db";

// POST /api/posts/[id]/save - save a post
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userEmail = session.user.email ?? "";

    const [userRows]: any = await query(
      "SELECT user_id FROM users WHERE email = ?",
      [userEmail]
    );
    if (userRows.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    await query(
      "INSERT IGNORE INTO saved_posts (user_id, post_id) VALUES (?, ?)",
      [userRows[0].user_id, params.id]
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
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userEmail = session.user.email ?? "";

    const [userRows]: any = await query(
      "SELECT user_id FROM users WHERE email = ?",
      [userEmail]
    );
    if (userRows.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    await query(
      "DELETE FROM saved_posts WHERE user_id = ? AND post_id = ?",
      [userRows[0].user_id, params.id]
    );

    return NextResponse.json({ saved: false });
  } catch (error) {
    console.error("Unsave error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
