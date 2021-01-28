const withPlugins = require('next-compose-plugins');
const withPWA = require('next-pwa');
const withPreact = require('next-plugin-preact');
const withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: process.env.ANALYZE === 'true'
});

module.exports = withPlugins(
    [
        withPreact,
        [
            withPWA,
            {
                pwa: {
                    dest: 'public',
                    disable: process.env.NODE_ENV === 'development'
                }
            }
        ],
        [withBundleAnalyzer],
    ],
    {
        i18n: {
            locales: ['en-US'],
            defaultLocale: 'en-US'
        },
        images: {
            deviceSizes: [480, 640, 750, 828, 1080, 1200, 1920, 2048, 3840],
            domains: [
                'prismic-io.s3.amazonaws.com',
                'i.scdn.co',
                'cdn-images-1.medium.com',
            ],
        },
        redirects() {
            return []
        },
    }
);