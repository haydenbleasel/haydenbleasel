import React, { ReactNode } from 'react';
import { NextSeo, SocialProfileJsonLd } from 'next-seo';
import { useRouter } from 'next/router';

import 'notyf/notyf.min.css';
import styles from './Layout.module.css';
import Header from '../Header';
import Footer from '../Footer';

type LayoutProps = {
  children?: ReactNode
  title?: string,
  description?: string,
  images?: any,
}

const name = 'Hayden Bleasel';
const username = 'haydenbleasel';

const socialPlatforms = [
  { name: 'Twitter', url: 'https://twitter.com/haydenbleasel', image: '/images/social/twitter.svg' },
  { name: 'Dribbble', url: 'https://dribbble.com/haydenbleasel', image: '/images/social/dribbble.svg' },
  { name: 'Instagram', url: 'https://www.instagram.com/hayden.bleasel/', image: '/images/social/instagram.svg' },
  { name: 'GitHub', url: 'https://github.com/haydenbleasel/', image: '/images/social/github.svg' },
  { name: 'LinkedIn', url: 'https://www.linkedin.com/in/haydenbleasel', image: '/images/social/linkedin.svg' },
  { name: 'ProductHunt', url: 'https://www.producthunt.com/@haydenbleasel', image: '/images/social/producthunt.svg' },
  { name: 'Spotify', url: 'https://open.spotify.com/user/haydenbleasel', image: '/images/social/spotify.svg' },
  // { name: 'YourStack', url: 'https://yourstack.com/@haydenbleasel', image: '/images/social/yourstack.png' },
];

const Layout = ({
  children,
  title = 'This is the default title',
  description = 'This is the default description',
  images = [],
}: LayoutProps) => {

  const { asPath, basePath } = useRouter();

  return (
    <>
      <NextSeo
        titleTemplate={`%s | ${name}`}
        title={title}
        description={description}
        canonical={asPath}
        openGraph={{
          url: asPath,
          title,
          description,
          images: [
            ...images,
            {
              url: `${basePath}/images/cover.jpg`,
              width: 1200,
              height: 630,
              alt: name,
            },
          ],
          site_name: name,
          type: 'profile',
          profile: {
            firstName: name.split(' ')[0],
            lastName: name.split(' ')[1],
            username: username,
            gender: 'male',
          },
        }}
        twitter={{
          handle: `@${username}`,
          site: `@${username}`,
          cardType: 'summary_large_image',
        }}
      />

      <SocialProfileJsonLd
        type="Person"
        name={name}
        url={basePath}
        sameAs={socialPlatforms.map(({ url }) => url)}
      />
      
      <div className={styles.grid}>
        <div className={styles.container}>
          <Header />
          {children}
          <Footer socialPlatforms={socialPlatforms} />
        </div>
      </div>
    </>
  );
}

export default Layout;