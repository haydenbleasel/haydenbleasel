type PrismicVideo = {
  account_type: string;
  author_name: string;
  author_url: string;
  description: string;
  duration: number;
  embed_url: string;
  height: number;
  html: string;
  is_plus: string;
  provider_name: string;
  provider_url: string;
  thumbnail_height: number;
  thumbnail_url: string;
  thumbnail_url_with_play_button: string;
  thumbnail_width: number;
  title: string;
  type: string;
  upload_date: string;
  uri: string;
  version: string;
  video_id: number;
  width: number;
};

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
  available_for_hire: boolean;
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
  newsletter_success_alert: string;
  newsletter_error_alert: string;
};

type PrismicRole = {
  image: PrismicImage;
  video: PrismicVideo;
  title: string;
  description: string;
  date: string;
  content: PrismicRichText;
  featured: boolean;
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
