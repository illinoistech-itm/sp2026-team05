import { query } from "@/lib/db";

type SessionUser = {
  email?: string | null;
  name?: string | null;
  image?: string | null;
};

type AppUser = {
  user_id: number;
  username: string;
  email: string;
  profile_pic_url: string | null;
};

function slugifyUsername(value: string) {
  const cleaned = value
    .toLowerCase()
    .replace(/[^a-z0-9._-]/g, "")
    .slice(0, 40);

  return cleaned || "user";
}

async function generateUniqueUsername(user: SessionUser) {
  const emailPrefix = user.email?.split("@")[0] ?? "";
  const nameSlug = slugifyUsername(user.name ?? "");
  const emailSlug = slugifyUsername(emailPrefix);
  const baseUsername = nameSlug !== "user" ? nameSlug : emailSlug;

  for (let suffix = 0; suffix < 1000; suffix += 1) {
    const candidate =
      suffix === 0 ? baseUsername : `${baseUsername}${suffix}`.slice(0, 50);
    const [rows]: any = await query(
      "SELECT user_id FROM users WHERE username = ? LIMIT 1",
      [candidate]
    );

    if (rows.length === 0) {
      return candidate;
    }
  }

  return `user${Date.now()}`.slice(0, 50);
}

export async function ensureCurrentUser(user: SessionUser) {
  const email = user.email?.trim().toLowerCase();

  if (!email) {
    throw new Error("Authenticated user is missing an email address");
  }

  const [existingRows]: any = await query(
    "SELECT user_id, username, email, profile_pic_url FROM users WHERE email = ? LIMIT 1",
    [email]
  );

  if (existingRows.length > 0) {
    const existingUser = existingRows[0] as AppUser;

    if (user.image && existingUser.profile_pic_url !== user.image) {
      await query(
        "UPDATE users SET profile_pic_url = ? WHERE user_id = ?",
        [user.image, existingUser.user_id]
      );
      existingUser.profile_pic_url = user.image;
    }

    return existingUser;
  }

  const username = await generateUniqueUsername(user);

  try {
    const [result]: any = await query(
      "INSERT INTO users (username, email, password_hash, profile_pic_url) VALUES (?, ?, ?, ?)",
      [username, email, "__oauth_google__", user.image ?? null]
    );

    return {
      user_id: result.insertId,
      username,
      email,
      profile_pic_url: user.image ?? null,
    } satisfies AppUser;
  } catch (error: any) {
    if (error?.code === "ER_DUP_ENTRY") {
      const [rows]: any = await query(
        "SELECT user_id, username, email, profile_pic_url FROM users WHERE email = ? LIMIT 1",
        [email]
      );

      if (rows.length > 0) {
        return rows[0] as AppUser;
      }
    }

    throw error;
  }
}
