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
            </Head>
            <Component {...pageProps} />
        </>
    );
}