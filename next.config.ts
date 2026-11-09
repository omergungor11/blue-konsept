import type { NextConfig } from "next";

const config: NextConfig = {
  turbopack: { root: process.cwd() },
  devIndicators: false,
  poweredByHeader: false,
  async rewrites() {
    return {
      beforeFiles: [{
        source: "/work",
        has: [{ type: "query", key: "cfd34c6a_page", value: "(?<page>[2-7])" }],
        destination: "/work/page/:page",
      }],
      afterFiles: [],
      fallback: [],
    };
  },
  async headers() {
    return [{
      source: "/:path*",
      headers: [{ key: "Content-Security-Policy", value: "form-action 'self'; base-uri 'self'; frame-ancestors 'none'" }],
    }];
  },
};

export default config;
