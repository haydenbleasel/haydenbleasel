import React, { useEffect } from 'react';
import { AppProps } from 'next/app';
import Head from 'next/head';
import * as Fathom from 'fathom-client';
import { useRouter } from 'next/router';
import './styles.css';

import { siteUrl } from '../next-sitemap';

export default ({ Component, pageProps }: AppProps): JSX.Element => {

    const router = useRouter();

    useEffect(() => {
        Fathom.load(process.env.NEXT_PUBLIC_FATHOM_SITE_ID as string, {
            includedDomains: [siteUrl.replace('https://', '')],
        })

        function onRouteChangeComplete() {
            Fathom.trackPageview();
        }
        
        router.events.on('routeChangeComplete', onRouteChangeComplete);

        return () => {
            router.events.off('routeChangeComplete', onRouteChangeComplete)
        };
    }, []);

    return (
        <>
            <Head>
                <meta charSet="utf-8" />
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />

                <meta name="application-name" content="Hayden Bleasel" />
                <meta name="apple-mobile-web-app-capable" content="yes" />
                <meta name="apple-mobile-web-app-status-bar-style" content="default" />
                <meta name="apple-mobile-web-app-title" content="Hayden Bleasel" />

                <meta name="format-detection" content="telephone=no" />
                <meta name="mobile-web-app-capable" content="yes" />
                <meta name="msapplication-config" content="/browserconfig.xml" />
                <meta name="msapplication-TileColor" content="#2B5797" />
                <meta name="msapplication-tap-highlight" content="no" />
                <meta name="theme-color" content="#0C0D15" />
                <link rel="manifest" href="/manifest.json" />

                {[57, 60, 72, 76, 114, 120, 144, 152, 180].map((size) => (
                    <link rel="apple-touch-icon" sizes={`${size}x${size}`} href={`/apple-touch-icon-${size}x${size}.png`} />
                ))}

                {[16, 32, 194].map((size) => (
                    <link rel="icon" type="image/png" sizes={`${size}x${size}`} href={`/favicon-${size}x${size}.png`} />
                ))}

                <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
                <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#0c0d15" />

                {[450, 650].map((weight) => (
                    <link rel="preload" href={`/fonts/UniversalSans-v1-2-0-50-0-721212122121-01-${weight}.woff`} as="font" type="font/woff" />
                ))}

            </Head>
            <Component {...pageProps} />
        </>
    );
}