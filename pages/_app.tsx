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
                <link rel="preload" href="/fonts//fonts/UniversalSans-v1-2-0-50-0-721212122121-01-450.woff" as="font" type="font/woff" />
                <link rel="preload" href="/fonts//fonts/UniversalSans-v1-2-0-50-0-721212122121-01-650.woff" as="font" type="font/woff" />
            </Head>
            <Component {...pageProps} />
        </>
    );
}