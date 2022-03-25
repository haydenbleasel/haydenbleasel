import type { NextPage } from 'next';
import { NextSeo, SocialProfileJsonLd } from "next-seo";
import { Toaster } from 'react-hot-toast';

import Image from 'next/image';
import Link from '../components/link';
import Client from '../components/client';
import Social from '../components/social';

import CorelliumLogo from '../public/images/logos/corellium.svg';
import GoogleLogo from '../public/images/logos/google.svg';
import PalantirLogo from '../public/images/logos/palantir.svg';
import NikeLogo from '../public/images/logos/nike.svg';
import ToyotaLogo from '../public/images/logos/toyota.svg';
import NatgeoLogo from '../public/images/logos/natgeo.svg';
import TimberlandLogo from '../public/images/logos/timberland.svg';
import CanvaLogo from '../public/images/logos/canva.svg';
import WestfieldLogo from '../public/images/logos/westfield.svg';
import AusethicalLogo from '../public/images/logos/ausethical.svg';
import JellypepperLogo from '../public/images/logos/jellypepper.svg';
import ClipchampLogo from '../public/images/logos/clipchamp.svg';
import BarajaLogo from '../public/images/logos/baraja.svg';
import BrighteLogo from '../public/images/logos/brighte.svg';
import SpacemachinesLogo from '../public/images/logos/spacemachines.svg';
import InventiaLogo from '../public/images/logos/inventia.svg';
import LightswapLogo from '../public/images/logos/lightswap.svg';
import SpaceshipLogo from '../public/images/logos/spaceship.svg';
import ESLintLogo from '../public/images/logos/eslint.svg';
import AirwallexLogo from '../public/images/logos/airwallex.svg';
import BokehLogo from '../public/images/logos/bokeh.svg';
import NeutralLogo from '../public/images/logos/neutral.svg';
import PresumiLogo from '../public/images/logos/presumi.svg';

import DevtoLogo from '../public/images/social/devto.svg';
import DribbbleLogo from '../public/images/social/dribbble.svg';
import FigmaLogo from '../public/images/social/figma.svg';
import GithubLogo from '../public/images/social/github.svg';
import InstagramLogo from '../public/images/social/instagram.svg';
import LinkedinLogo from '../public/images/social/linkedin.svg';
import MediumLogo from '../public/images/social/medium.svg';
import ProductHuntLogo from '../public/images/social/producthunt.svg';
import SpotifyLogo from '../public/images/social/spotify.svg';
import TwitterLogo from '../public/images/social/twitter.svg';

import Spline from '../public/images/spline.png';
import Photo from '../public/images/photo.jpg';
import styles from './home.module.css';

const siteUrl = 'https://haydenbleasel.com/';

const clients = {
  corellium: {
    name: 'Corellium',
    url: 'https://www.corellium.com/',
    logo: CorelliumLogo as string,
  },
  google: {
    name: 'Google',
    url: 'https://google.com/',
    logo: GoogleLogo as string,
  },
  palantir: {
    name: 'Palantir',
    url: 'https://www.palantir.com/',
    logo: PalantirLogo as string,
  },
  nike: {
    name: 'Nike',
    url: 'https://www.nike.com/au/',
    logo: NikeLogo as string,
  },
  toyota: {
    name: 'Toyota',
    url: 'https://www.toyota.com.au/',
    logo: ToyotaLogo as string,
  },
  natgeo: {
    name: 'National Geographic',
    url: 'https://www.nationalgeographic.com/',
    logo: NatgeoLogo as string,
  },
  timberland: {
    name: 'Timberland',
    url: 'https://www.timberland.com.au/',
    logo: TimberlandLogo as string,
  },
  canva: {
    name: 'Canva',
    url: 'https://www.canva.com/en_gb/',
    logo: CanvaLogo as string,
  },
  westfield: {
    name: 'Westfield',
    url: 'https://www.westfield.com/',
    logo: WestfieldLogo as string,
  },
  ausethical: {
    name: 'Australian Ethical',
    url: 'https://www.australianethical.com.au/',
    logo: AusethicalLogo as string,
  },
  jellypepper: {
    name: 'Jellypepper',
    url: 'https://jellypepper.com/',
    logo: JellypepperLogo as string,
  },
  clipchamp: {
    name: 'Clipchamp',
    url: 'https://jellypepper.com/work/clipchamp',
    logo: ClipchampLogo as string,
  },
  baraja: {
    name: 'Baraja',
    url: 'https://jellypepper.com/work/baraja',
    logo: BarajaLogo as string,
  },
  brighte: {
    name: 'Brighte',
    url: 'https://jellypepper.com/work/brighte',
    logo: BrighteLogo as string,
  },
  spacemachines: {
    name: 'Space Machines Company',
    url: 'https://jellypepper.com/work/space-machines',
    logo: SpacemachinesLogo as string,
  },
  inventia: {
    name: 'Inventia Life Science',
    url: 'https://jellypepper.com/work/inventia',
    logo: InventiaLogo as string,
  },
  lightswap: {
    name: 'Lightswap',
    url: 'https://jellypepper.com/work/lightswap',
    logo: LightswapLogo as string,
  },
  spaceship: {
    name: 'Spaceship',
    url: 'https://www.spaceship.com.au/',
    logo: SpaceshipLogo as string,
  },
  airwallex: {
    name: 'Airwallex',
    url: 'https://www.airwallex.com/au',
    logo: AirwallexLogo as string,
  },
  eslint: {
    name: 'ESLint',
    url: 'https://eslint.org/',
    logo: ESLintLogo as string,
  },
  bokeh: {
    name: 'Bokeh',
    url: 'https://heybokeh.com/',
    logo: BokehLogo as string,
  },
  neutral: {
    name: 'Neutral',
    url: 'https://tryneutral.com/',
    logo: NeutralLogo as string,
  },
  presumi: {
    name: 'Presumi',
    url: 'https://haydenbleasel.medium.com/presumi-4d4a2ba0fc6c',
    logo: PresumiLogo as string,
  },
};

const social = {
  twitter: {
    name: 'Twitter',
    url: "https://twitter.com/haydenbleasel",
    logo: TwitterLogo as string,
  },
  dribbble: {
    name: 'Dribbble',
    url: "https://dribbble.com/haydenbleasel",
    logo: DribbbleLogo as string,
  },
  instagram: {
    name: 'Instagram',
    url: "https://www.instagram.com/hayden.bleasel/",
    logo: InstagramLogo as string,
  },
  github: {
    name: 'GitHub',
    url: "https://github.com/haydenbleasel/",
    logo: GithubLogo as string,
  },
  linkedin: {
    name: 'LinkedIn',
    url: "https://www.linkedin.com/in/haydenbleasel",
    logo: LinkedinLogo as string,
  },
  producthunt: {
    name: 'ProductHunt',
    url: "https://www.producthunt.com/@haydenbleasel",
    logo: ProductHuntLogo as string,
  },
  spotify: {
    name: 'Spotify',
    url: "https://open.spotify.com/user/haydenbleasel",
    logo: SpotifyLogo as string,
  },
  devto: {
    name: 'Dev.to',
    url: "https://dev.to/haydenbleasel",
    logo: DevtoLogo as string,
  },
  figma: {
    name: 'Figma',
    url: "https://www.figma.com/@haydenbleasel",
    logo: FigmaLogo as string,
  },
  medium: {
    name: 'Medium',
    url: "https://haydenbleasel.medium.com/",
    logo: MediumLogo as string,
  },
};

const Home: NextPage = () => (
  <>
    <NextSeo
      title="Hayden Bleasel — Chief Product Officer at Corellium"
      description="Hi, I’m Hayden Bleasel. I lead the Product and Design teams at Corellium where I help shape the direction of our brand and product, blurring the line between real and virtual."
      canonical={siteUrl}
      openGraph={{
        url: siteUrl,
        title: 'Hayden Bleasel',
        description: 'Hi, I’m Hayden Bleasel. I lead the Product and Design teams at Corellium where I help shape the direction of our brand and product, blurring the line between real and virtual.',
        images: [{
          url: `${siteUrl}/images/cover.jpg`,
          width: 1200,
          height: 630,
          alt: 'A spline',
          type: 'image/jpeg',
        }],
        // eslint-disable-next-line camelcase, @typescript-eslint/naming-convention
        site_name: 'Hayden Bleasel',
        type: "profile",
        profile: {
          firstName: "Hayden",
          lastName: "Bleasel",
          username: "haydenbleasel",
          gender: "male",
        },
      }}
      twitter={{
        handle: '@haydenbleasel',
        site: '@haydenbleasel',
        cardType: "summary_large_image",
      }}
    />

    <SocialProfileJsonLd
      type="Person"
      name="Hayden Bleasel"
      url={siteUrl}
      sameAs={Object.values(social).map(({ url }) => url)}
    />

    <main className={styles.main}>
      <section className={styles.content}>

        <div className={styles.photo}>
          <Image src={Photo} width={48} height={48} alt="" priority quality={100} />
        </div>

        <h1>Hi, I’m Hayden Bleasel. I lead the Product and Design teams at <Client {...clients.corellium} />, shaping the direction of our digital experiences and blurring the line between real and virtual.</h1>

        <div className={styles.bio}>
          <p>I’m an Australian he/him living in Sydney. I enjoy turning complex problems into meaningful solutions through design and code. I focus on simplicity, thoughtfulness, accessibility and a learning-based approach to my work.</p>
          <p>I’ve had the privilege of working with many fantastic companies including <Client {...clients.google} />, <Client {...clients.palantir} />, <Client {...clients.nike} />, <Client {...clients.toyota} />, <Client {...clients.natgeo} />, <Client {...clients.timberland} />, <Client {...clients.canva} />, <Client {...clients.westfield} /> and <Client {...clients.ausethical} />.</p>
          <p>Previously I ran an agency called <Client {...clients.jellypepper} /> where I worked with incredible startups and projects, including <Client {...clients.clipchamp} />, <Client {...clients.baraja} />, <Client {...clients.brighte} />, <Client {...clients.spaceship} />, <Client {...clients.spacemachines} />, <Client {...clients.inventia} />, <Client {...clients.lightswap} />, <Client {...clients.airwallex} /> and <Client {...clients.eslint} />.</p>
          <p>After hours, I’m the design half of <Client {...clients.bokeh} /> — a new type of portfolio for photographers designed to showcase a meaningful body of work by going beyond likes, hashtags and scrolling.</p>
          <p>I’m also working on <Client {...clients.neutral} /> — an app which so far has helped plant thousands of trees and offset hundreds of tonnes of CO₂e through global reforestation programs. Back in the day, I made <Client {...clients.presumi} /> — a resume analytics platform that SEEK used in Hong Kong to process 100K+ job applications and analyse 1M+ data points.</p>
          <p>In 2016, I graduated from the University of Technology, Sydney with two Bachelors degrees — Business and Information Technology. I also ocassionally take on random courses such as HarvardX’s CS50 for fun.</p>
          <p>If you want to read more about my work, check out my <Link href={social.linkedin.url}>LinkedIn</Link>. If you want to chat, DM me on <Link href={social.twitter.url}>Twitter</Link>!</p>
        </div>
        <p>✌️</p>
      </section>
      <section className={styles.aside}>
        <Image src={Spline} layout="fill" alt="" objectFit="contain" objectPosition="top right" quality={100} placeholder="empty" />
      </section>
      <div className={styles.social}>
        {Object.values(social).map(Social)}
      </div>
    </main>

    <Toaster toastOptions={{
      duration: 5000,
      position: 'bottom-right',
      style: {
        color: 'var(--black)',
        background: 'var(--white)',
        border: '2px solid var(--divider)',
      },
      success: {
        icon: '👍',
        style: {
          borderColor: 'var(--green)',
        },
      },
      error: {
        icon: '😭',
        style: {
          borderColor: 'var(--red)',
        },
      },
    }} />
  </>
);

export default Home;
