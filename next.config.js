/** @type {import('next').NextConfig} */

// Content Security Policy — allows the third parties the site actually uses
// (Google AdSense, Instagram embeds, Vercel Speed Insights, the Render backend +
// its websocket). 'unsafe-inline'/'unsafe-eval' are required by Next.js' runtime,
// JSON-LD blocks and AdSense. Tighten further once those are nonce-compatible.
const ContentSecurityPolicy = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://pagead2.googlesyndication.com https://partner.googleadservices.com https://www.googletagservices.com https://adservice.google.com https://www.instagram.com https://platform.instagram.com https://*.vercel-scripts.com https://va.vercel-scripts.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  "connect-src 'self' https://backend-j3mf.onrender.com wss://backend-j3mf.onrender.com https://*.onrender.com wss://*.onrender.com https://*.vercel-scripts.com https://va.vercel-scripts.com https://pagead2.googlesyndication.com https://*.google-analytics.com",
  "frame-src 'self' https://www.instagram.com https://googleads.g.doubleclick.net https://tpc.googlesyndication.com https://*.doubleclick.net https://www.google.com",
  "frame-ancestors 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "upgrade-insecure-requests",
].join('; ');

const securityHeaders = [
  // Force HTTPS for 2 years, including subdomains (safe once the domain is HTTPS-only)
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  // Stop the browser from MIME-sniffing a response away from the declared type
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  // Clickjacking protection (CSP frame-ancestors is the modern equivalent)
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  // Don't leak full URLs to other origins
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  // Lock down powerful browser features the site doesn't use
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()' },
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  { key: 'Content-Security-Policy', value: ContentSecurityPolicy },
];

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false, // hide "X-Powered-By: Next.js" from responses
  compress: true,
  images: {
    // blog/project/product images can come from the Render backend or common hosts
    remotePatterns: [
      { protocol: 'https', hostname: '**.onrender.com' },
      { protocol: 'https', hostname: 'i.imgur.com' },
      { protocol: 'https', hostname: 'res.cloudinary.com' },
    ],
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },
};

module.exports = nextConfig;
