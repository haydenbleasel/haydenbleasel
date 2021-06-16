import { NextSeo, SocialProfileJsonLd } from "next-seo";
import { useRouter } from "next/router";
import { siteUrl } from "../next-sitemap";
import Header from "./header";
import Footer from "./footer";
import { resolveLink } from "../utils/prismic";

type LayoutProps = {
  children: any;
  title: string;
  description: string;
  settings: PrismicSettings,
};

const name = "Hayden Bleasel";
const username = "haydenbleasel";

const image = {
  url: `${siteUrl}/images/cover.jpg`,
  width: 1200,
  height: 630,
  alt: name,
};

const Layout = ({
  children,
  title = "This is the default title",
  description = "This is the default description",
  settings,
}: LayoutProps) => {
  const { pathname } = useRouter();

  return (
    <>
      <NextSeo
        titleTemplate={`%s | ${name}`}
        title={title}
        description={description}
        canonical={`${siteUrl}${pathname}`}
        openGraph={{
          url: pathname,
          title,
          description,
          images: [image],
          site_name: name,
          type: "profile",
          profile: {
            firstName: name.split(" ")[0],
            lastName: name.split(" ")[1],
            username: username,
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
        url={siteUrl}
        sameAs={settings.social.map(({ social_link }) => resolveLink(social_link))}
      />

      <Header settings={settings} />

      {children}

      <Footer settings={settings} />
    </>
  );
};

export default Layout;
