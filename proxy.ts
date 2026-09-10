import { withAuth } from "@kinde-oss/kinde-auth-nextjs/middleware";
import EventEmitter from "events";
import { NextRequest } from "next/server";

EventEmitter.defaultMaxListeners = 20;

export default withAuth(
  async function proxy(req: NextRequest) {
    //console.log("proxy.ts: req.url", req.url);
  }, {
    isReturnToCurrentPage: true,
  }
)

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|auth|favicon.ico|robots.txt|images|login|$).*)"],
};