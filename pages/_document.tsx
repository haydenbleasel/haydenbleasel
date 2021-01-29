import NextDocument, { Html, Head, Main, NextScript } from 'next/document';
import React from 'react';

class Document extends NextDocument<any> {
    render() {
        return (
            <Html lang="en">
                <Head />
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        )
    }
}

export default Document;