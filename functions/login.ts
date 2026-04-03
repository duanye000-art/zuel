export const onRequest: PagesFunction = async ({ request, env }) => {
  const url = new URL(request.url);
  const redirect = url.searchParams.get("redirect") || "/";

  if (request.method === "POST") {
    const formData = await request.formData();
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;

    if (username === env.USERNAME && password === env.PASSWORD) {
      // 登录成功，设置 cookie（有效期 7 天）
      const headers = new Headers();
      headers.append("Set-Cookie", `auth=valid; Path=/; Max-Age=604800; HttpOnly; Secure`);
      headers.append("Location", redirect);

      return new Response(null, { status: 302, headers });
    } else {
      // 登录失败，返回带错误信息的登录页
      return new Response(generateLoginHTML(true, redirect), {
        headers: { "Content-Type": "text/html" },
      });
    }
  }

  // GET 请求：显示登录页面
  return new Response(generateLoginHTML(false, redirect), {
    headers: { "Content-Type": "text/html" },
  });
};

// 生成登录页面的 HTML（你可以自己修改样式）
function generateLoginHTML(hasError: boolean, redirect: string) {
  return `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>登录 - 私人页面</title>
  <style>
    body { font-family: system-ui, sans-serif; background: #f4f4f9; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; }
    .login-box { background: white; padding: 40px 30px; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); width: 100%; max-width: 380px; }
    h1 { text-align: center; margin-bottom: 30px; color: #333; }
    input { width: 100%; padding: 12px; margin: 10px 0; border: 1px solid #ddd; border-radius: 6px; font-size: 16px; box-sizing: border-box; }
    button { width: 100%; padding: 12px; background: #0066ff; color: white; border: none; border-radius: 6px; font-size: 16px; cursor: pointer; margin-top: 10px; }
    button:hover { background: #0052cc; }
    .error { color: #d32f2f; text-align: center; margin: 10px 0; }
    .footer { text-align: center; margin-top: 20px; font-size: 14px; color: #666; }
  </style>
</head>
<body>
  <div class="login-box">
    <h1>🔒 登录</h1>
    ${hasError ? '<div class="error">用户名或密码错误，请重试</div>' : ''}
    <form method="POST">
      <input type="text" name="username" placeholder="用户名" required autocomplete="username">
      <input type="password" name="password" placeholder="密码" required autocomplete="current-password">
      <button type="submit">登录</button>
    </form>
    <div class="footer">只有授权用户可以访问</div>
  </div>
</body>
</html>`;
}
