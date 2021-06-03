/// <reference types="next" />
/// <reference types="next/types/global" />

type PrismicImage = {
  url: string;
  dimensions: {
    width: number;
    height: number;
  };
  alt?: string;
};

type PrismicLink = {
  id?: string;
  type?: string;
  tags?: any[];
  slug?: string;
  lang?: string;
  uid?: string;
  link_type?: string;
  isBroken?: boolean;
  url?: string;
};

type PrismicRichText = {
  type: string;
  text: string;
  spans: any[];
}[];

type PrismicSettings = {
  logo: PrismicImage;
  logo_link: PrismicLink;
  header_sitemap: {
    sitemap_label: string;
    sitemap_link: PrismicLink;
  }[];
  footer_content: PrismicRichText;
  footer_newsletter_label: string;
  footer_newsletter_placeholder: string;
  footer_disclaimer: PrismicRichText;
  social: {
    social_icon: PrismicImage;
    social_name: string;
    social_link: PrismicLink;
  }[];
};

type PrismicRole = {
  image: PrismicImage;
  title: string;
  description: string;
  date: string;
  content: PrismicRichText;
};

type PrismicProject = {
  image: PrismicImage;
  title: string;
  description: string;
  status: string;
  content: PrismicRichText;
  action_cta: string;
  action_link: PrismicLink;
};

type IPost = {
  id: string;
  title: string;
  link: PrismicLink;
  caption: string;
  description: string;
  image: PrismicImage;
};
