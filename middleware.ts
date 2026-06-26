// middleware.ts
export { default } from "next-auth/middleware";

export const config = {
  
  matcher: ["/", "/community/:path*", "/lesson/:path*", "/new-generation/:path*"], 
};