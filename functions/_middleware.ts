export const onRequest: PagesFunction = async (context) => {
  const { request, env, next } = context;

  // 检查是否已经有有效的登录 cookie
  const cookie = request.headers.get("Cookie") || "";
  if (cookie.includes("auth=valid")) {
    return next(); // 已登录，直接放行
  }

  const url = new URL(request.url);

  // 不保护登录页面本身
  if (url.pathname === "/login") {
    return next();
  }

  // 其他页面重定向到登录页
  return Response.redirect(url.origin + "/login?redirect=" + encodeURIComponent(url.pathname), 302);
};
