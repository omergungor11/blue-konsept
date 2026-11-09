import { NextRequest, NextResponse } from "next/server";

export function POST(request: NextRequest) {
  const fallback = new URL("/", request.url);
  const referrer = request.headers.get("referer");

  if (referrer) {
    try {
      const source = new URL(referrer);
      if (source.origin === fallback.origin && source.pathname !== "/forms/demo") {
        fallback.pathname = source.pathname;
      }
    } catch {
      // An invalid referrer returns to the homepage.
    }
  }

  fallback.searchParams.set("demo", "form");
  return NextResponse.redirect(fallback, 303);
}
