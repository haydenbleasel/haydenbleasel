import { useEffect } from "react";
import type { AppProps } from "next/app";
import Head from "next/head";
import { load, trackPageview } from "fathom-client";
import { useRouter } from "next/router";
import "./styles.css";

import { siteUrl } from "../next-sitemap";

const App = ({ Component, pageProps }: AppProps): JSX.Element => {
  const router = useRouter();

  useEffect(() => {
    load(process.env.NEXT_PUBLIC_FATHOM_SITE_ID as string, {
      includedDomains: [siteUrl.replace("https://", "")],
    });

    function onRouteChangeComplete() {
      trackPageview();
    }

    router.events.on("routeChangeComplete", onRouteChangeComplete);

    return () => {
      router.events.off("routeChangeComplete", onRouteChangeComplete);
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
        <meta name="msapplication-TileColor" content="#FFFFFF" />
        <meta name="msapplication-tap-highlight" content="no" />
        <meta name="theme-color" content="#FFFFFF" />
        <link rel="manifest" href="/manifest.json" />

        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/svg+xml" sizes="any" href="/favicon.svg" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#1D1D1D" />

        <link
          rel="preload"
          href="/fonts/lausanne/TWKLausanne-300.woff"
          as="font"
          type="font/woff"
        />
        <link
          rel="preload"
          href="/fonts/lausanne/TWKLausanne-300.woff2"
          as="font"
          type="font/woff2"
        />
        <link
          rel="preload"
          href="/fonts/gtsuper/GT-Super-Display-Light-Italic.woff"
          as="font"
          type="font/woff"
        />
        <link
          rel="preload"
          href="/fonts/gtsuper/GT-Super-Display-Light-Italic.woff2"
          as="font"
          type="font/woff2"
        />
      </Head>
      <Component {...pageProps} />
    </>
  );
};

export default App;
