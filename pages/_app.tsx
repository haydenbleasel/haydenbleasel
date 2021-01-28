import * as React from 'react';
import { AppProps } from 'next/app';
import Head from 'next/head';

import './styles.css';

export default function MyApp({ Component, pageProps }: AppProps): JSX.Element {
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
                <meta name="theme-color" content="#000000" />

                <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
                <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
                <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
                <link rel="manifest" href="/manifest.json" />
                <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
                <link rel="shortcut icon" href="/favicon.ico" />

                <link rel="preload" href="/fonts/UniversalSans-v1-2-0-50-0-721212122121-01-450.woff" as="font" type="font/woff" />
                <link rel="preload" href="/fonts/UniversalSans-v1-2-0-50-0-721212122121-01-650.woff" as="font" type="font/woff" />

            </Head>
            <Component {...pageProps} />
        </>
    );
}