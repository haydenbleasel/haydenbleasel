import { useEffect, useState } from 'react';
import { NextSeo, SocialProfileJsonLd } from 'next-seo';
import { useRouter } from 'next/router';
import { siteUrl } from '../next-sitemap';
import Header from './header';
import Footer from './footer';

import 'notyf/notyf.min.css';

type LayoutProps = {
  children?: any;
  title?: string,
  description?: string,
  openGraph?: any,
  image?: any,
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
  openGraph = {},
  image = {
    url: `${siteUrl}/images/cover.jpg`,
    width: 1200,
    height: 630,
    alt: name,
  },
}: LayoutProps) => {
  const { asPath } = useRouter();
  const [bodyFixed, setBodyFixed] = useState(false);
  
  useEffect(() => {
    document.body.style.overflow = bodyFixed ? 'hidden' : 'unset';
    document.body.style.position = bodyFixed ? "fixed" : "unset";
    document.body.style.width = bodyFixed ? "100vw" : "unset";
  }, [bodyFixed]);

  return (
    <>
      <NextSeo
        titleTemplate={`%s | ${name}`}
        title={title}
        description={description}
        canonical={`${siteUrl}${asPath}`}
        openGraph={{
          url: asPath,
          title,
          description,
          images: [image],
          site_name: name,
          type: 'profile',
          profile: {
            firstName: name.split(' ')[0],
            lastName: name.split(' ')[1],
            username: username,
            gender: 'male',
          },
          ...openGraph,
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
        url={siteUrl}
        sameAs={socialPlatforms.map(({ url }) => url)}
      />

      <Header onNavToggle={() => setBodyFixed(!bodyFixed)} />
      
      {children}
      
      <Footer socialPlatforms={socialPlatforms} />
    </>
  );
}

export default Layout;
