import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  matcher: [
    // Match all paths except: api routes, _next static, _next image, favicon, manifest, sw
    "/((?!api|_next/static|_next/image|favicon\\.ico|manifest\\.json|sw\\.js|icons).*)",
  ],
};
