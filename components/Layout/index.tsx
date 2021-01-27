import React, { ReactNode } from 'react';
import Head from 'next/head';

import 'notyf/notyf.min.css';
import styles from './Layout.module.css';
import Header from '../Header';
import Footer from '../Footer';

type LayoutProps = {
  children?: ReactNode
  title?: string
}

const Layout = ({
  children,
  title = 'This is the default title'
}: LayoutProps) => {

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      
      <div className={styles.grid}>
        <div className={styles.container}>
          <Header />
          {children}
          <Footer />
        </div>
      </div>
    </>
  );
}

export default Layout;