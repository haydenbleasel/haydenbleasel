import type { ReactNode } from "react";
import { NextSeo, SocialProfileJsonLd } from "next-seo";
import { useRouter } from "next/router";
import Header from "./header";
import Footer from "./footer";
import { resolveLink } from "../utils/prismic";

type LayoutProps = {
  children: ReactNode;
  title: string;
  description: string;
  settings: PrismicSettings,
};

const name = "Hayden Bleasel";
const username = "haydenbleasel";

const Layout = ({
  children,
  title,
  description,
  settings,
}: LayoutProps) => {
  const { asPath } = useRouter();
  const url = `${process.env.NEXT_PUBLIC_SITE_URL}${asPath}`;

  return (
    <>
      <NextSeo
        titleTemplate={`%s | ${name}`}
        title={title}
        description={description}
        canonical={url}
        openGraph={{
          url,
          title,
          description,
          images: [{
            url: `${process.env.NEXT_PUBLIC_SITE_URL}/images/cover.jpg`,
            width: 1200,
            height: 630,
            alt: name,
          }],
          site_name: name,
          type: "profile",
          profile: {
            firstName: name.split(" ")[0],
            lastName: name.split(" ")[1],
            username,
            gender: "male",
          },
        }}
        twitter={{
          handle: `@${username}`,
          site: `@${username}`,
          cardType: "summary_large_image",
        }}
      />

      <SocialProfileJsonLd
        type="Person"
        name={name}
        url={process.env.NEXT_PUBLIC_SITE_URL!}
        sameAs={settings.social.map(({ social_link }) => resolveLink(social_link))}
      />

      <Header settings={settings} />

      {children}

      <Footer settings={settings} />
    </>
  );
};

export default Layout;
