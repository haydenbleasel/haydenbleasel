import * as React from 'react';
import { AppProps } from 'next/app';

import './styles.css';

export default function MyApp({ Component, pageProps }: AppProps): JSX.Element {
    return (
        <Component {...pageProps} />
    );
}