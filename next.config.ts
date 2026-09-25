import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

function safeUrl(url: string | undefined): URL | null {
  if (!url) return null;
  try {
    return new URL(url);
  } catch {
    return null;
  }
}

const supabaseUrl = safeUrl(process.env.NEXT_PUBLIC_SUPABASE_URL);
const supabaseOrigin = supabaseUrl ? supabaseUrl.origin : "";

// Analitik ID'leri yoksa ilgili kaynaklara CSP izni de verilmez.
const hasGA = Boolean(process.env.NEXT_PUBLIC_GA_ID || process.env.NEXT_PUBLIC_GTM_ID);
const hasGTM = Boolean(process.env.NEXT_PUBLIC_GTM_ID);
const hasPixel = Boolean(process.env.NEXT_PUBLIC_META_PIXEL_ID);

const scriptSrc = ["'self'", "'unsafe-inline'"];
const connectSrc = ["'self'", supabaseOrigin].filter(Boolean);
const imgSrc = ["'self'", "data:", "blob:", supabaseOrigin].filter(Boolean);
const frameSrc: string[] = [];

if (!isProd) scriptSrc.push("'unsafe-eval'");
if (hasGA) {
  scriptSrc.push("https://www.googletagmanager.com");
  connectSrc.push(
    "https://www.google-analytics.com",
    "https://*.google-analytics.com",
    "https://*.analytics.google.com",
    "https://www.googletagmanager.com",
  );
  imgSrc.push("https://www.google-analytics.com", "https://www.googletagmanager.com");
}
if (hasGTM) frameSrc.push("https://www.googletagmanager.com");
if (hasPixel) {
  scriptSrc.push("https://connect.facebook.net");
  connectSrc.push("https://www.facebook.com", "https://connect.facebook.net");
  imgSrc.push("https://www.facebook.com");
}

const csp = [
  "default-src 'self'",
  `script-src ${scriptSrc.join(" ")}`,
  "style-src 'self' 'unsafe-inline'",
  `img-src ${imgSrc.join(" ")}`,
  "font-src 'self' data:",
  `connect-src ${connectSrc.join(" ")}`,
  frameSrc.length ? `frame-src ${frameSrc.join(" ")}` : "frame-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self' https://wa.me",
  "frame-ancestors 'self'",
  ...(isProd ? ["upgrade-insecure-requests"] : []),
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [60, 75, 85],
    remotePatterns: supabaseUrl
      ? [
          {
            protocol: supabaseUrl.protocol === "http:" ? "http" : "https",
            hostname: supabaseUrl.hostname,
            ...(supabaseUrl.port ? { port: supabaseUrl.port } : {}),
            pathname: "/storage/v1/object/public/**",
          },
        ]
      : [],
  },
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      {
        source: "/admin/:path*",
        headers: [
          { key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" },
          { key: "Cache-Control", value: "no-store, max-age=0" },
        ],
      },
    ];
  },
};

export default nextConfig;
