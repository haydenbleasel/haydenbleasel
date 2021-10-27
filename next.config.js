const { createSecureHeaders } = require('next-secure-headers');
const withPlugins = require('next-compose-plugins');
const withPWA = require('next-pwa');
const { withSentryConfig } = require('@sentry/nextjs');
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});
const redirects = require('./redirects.json');

const config = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [480, 640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: createSecureHeaders(),
      },
    ];
  },
  async redirects() {
    return redirects;
  },
};

module.exports = withPlugins(
  [
    [
      withPWA,
      {
        pwa: {
          dest: 'public',
          disable: process.env.NODE_ENV === 'development',
          dynamicStartUrl: false,
          mode: process.env.NODE_ENV,
        },
      },
    ],
    [
      withSentryConfig,
      {
        silent: true,
      },
    ],
    [withBundleAnalyzer],
  ],
  config
);
