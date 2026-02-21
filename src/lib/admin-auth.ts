import "server-only";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { verifyToken, COOKIE_NAME } from "@/lib/hmac";

// ── Server Component 二次鉴权：纵深防御，不完全依赖 middleware ──
export async function requireAdmin() {
  const cookieStore = cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;

  if (!token || !(await verifyToken(token))) {
    redirect("/admin/login");
  }
}
