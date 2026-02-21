import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { verifyToken, COOKIE_NAME } from "@/lib/hmac";
import LoginForm from "./LoginForm";

// Server Component：已登录 admin 直接重定向，零闪烁
// Next.js 14: cookies() 是同步调用
export default async function AdminLoginPage() {
  const cookieStore = cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;

  // 已认证 → 直接跳转，浏览器永远不会看到登录表单
  if (token && (await verifyToken(token))) {
    redirect("/admin");
  }

  return <LoginForm />;
}
