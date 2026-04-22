import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import db from "@/lib/db";
import { ensureCurrentUser } from "@/lib/current-user";

// GET /api/user/profile - get current user profile
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const currentUser = await ensureCurrentUser(session.user);
    const userEmail = currentUser.email;

    const [rows]: any = await db.execute(
      `SELECT 
        user_id, username, email, profile_pic_url, created_at,
        (SELECT COUNT(*) FROM follows WHERE followee_id = user_id) as followers_count,
        (SELECT COUNT(*) FROM follows WHERE follower_id = user_id) as following_count,
        (SELECT COUNT(*) FROM posts WHERE user_id = u.user_id) as posts_count
       FROM users u
       WHERE email = ?`,
      [userEmail]
    );

    return NextResponse.json({ user: rows[0] });
  } catch (error) {
    console.error("Profile fetch error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// PATCH /api/user/profile - update username or bio
export async function PATCH(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const currentUser = await ensureCurrentUser(session.user);
    const userEmail = currentUser.email;

    const body = await request.json();
    const { username, bio } = body;

    if (username) {
      // Check username isn't taken
      const [existing]: any = await db.execute(
        "SELECT user_id FROM users WHERE username = ? AND email != ?",
        [username, userEmail]
      );
      if (existing.length > 0) {
        return NextResponse.json({ error: "Username already taken" }, { status: 409 });
      }

      await db.execute(
        "UPDATE users SET username = ? WHERE email = ?",
        [username, userEmail]
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
