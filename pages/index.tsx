import type { NextPage } from 'next';
import type { FormEvent } from 'react';
import { NextSeo, SocialProfileJsonLd } from "next-seo";
import { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { trackGoal } from "fathom-client";
import Link from '../components/link';

import styles from './home.module.css';
import Image from 'next/image';
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

const clients = {
  corellium: {
    name: 'Corellium',
    url: 'https://corellium.com/',
    logo: CorelliumLogo,
  },
  google: {
    name: 'Google',
    url: 'https://google.com/',
    logo: GoogleLogo,
  },
  palantir: {
    name: 'Palantir',
    url: 'https://palantir.com/',
    logo: PalantirLogo,
  },
  nike: {
    name: 'Nike',
    url: 'https://nike.com/',
    logo: NikeLogo,
  },
  toyota: {
    name: 'Toyota',
    url: 'https://toyota.com/',
    logo: ToyotaLogo,
  },
  natgeo: {
    name: 'National Geographic',
    url: 'https://nationalgeographic.com/',
    logo: NatgeoLogo,
  },
  timberland: {
    name: 'Timberland',
    url: 'https://timberland.com/',
    logo: TimberlandLogo,
  },
  canva: {
    name: 'Canva',
    url: 'https://canva.com/',
    logo: CanvaLogo,
  },
  westfield: {
    name: 'Westfield',
    url: 'https://westfield.com/',
    logo: WestfieldLogo,
  },
  ausethical: {
    name: 'Australian Ethical',
    url: 'https://www.australianethical.com.au/',
    logo: AusethicalLogo,
  },
  jellypepper: {
    name: 'Jellypepper',
    url: 'https://jellypepper.com/',
    logo: JellypepperLogo,
  },
  clipchamp: {
    name: 'Clipchamp',
    url: 'https://jellypepper.com/work/clipchamp',
    logo: ClipchampLogo,
  },
  baraja: {
    name: 'Baraja',
    url: 'https://jellypepper.com/work/baraja',
    logo: BarajaLogo,
  },
  brighte: {
    name: 'Brighte',
    url: 'https://jellypepper.com/work/brighte',
    logo: BrighteLogo,
  },
  spacemachines: {
    name: 'Space Machines Company',
    url: 'https://jellypepper.com/work/space-machines',
    logo: SpacemachinesLogo,
  },
  inventia: {
    name: 'Inventia Life Science',
    url: 'https://jellypepper.com/work/inventia',
    logo: InventiaLogo,
  },
  lightswap: {
    name: 'Lightswap',
    url: 'https://jellypepper.com/work/lightswap',
    logo: LightswapLogo,
  },
  spaceship: {
    name: 'Spaceship',
    url: 'https://spaceship.com.au/',
    logo: SpaceshipLogo,
  },
  airwallex: {
    name: 'Airwallex',
    url: 'https://www.airwallex.com/au',
    logo: AirwallexLogo,
  },
  eslint: {
    name: 'ESLint',
    url: 'https://eslint.org/',
    logo: ESLintLogo,
  },
  bokeh: {
    name: 'Bokeh',
    url: 'https://heybokeh.com/',
    logo: BokehLogo,
  },
  neutral: {
    name: 'Neutral',
    url: 'https://neutral.sh/',
    logo: NeutralLogo,
  },
  presumi: {
    name: 'Presumi',
    url: 'https://presumi.com/',
    logo: PresumiLogo,
  },
};

const social = {
  twitter: {
    name: 'Twitter',
    url: "https://twitter.com/haydenbleasel",
    logo: TwitterLogo,
  },
  dribbble: {
    name: 'Dribbble',
    url: "https://dribbble.com/haydenbleasel",
    logo: DribbbleLogo,
  },
  instagram: {
    name: 'Instagram',
    url: "https://www.instagram.com/hayden.bleasel/",
    logo: InstagramLogo,
  },
  github: {
    name: 'GitHub',
    url: "https://github.com/haydenbleasel/",
    logo: GithubLogo,
  },
  linkedin: {
    name: 'LinkedIn',
    url: "https://www.linkedin.com/in/haydenbleasel",
    logo: LinkedinLogo,
  },
  producthunt: {
    name: 'ProductHunt',
    url: "https://www.producthunt.com/@haydenbleasel",
    logo: ProductHuntLogo,
  },
  spotify: {
    name: 'Spotify',
    url: "https://open.spotify.com/user/haydenbleasel",
    logo: SpotifyLogo,
  },
  devto: {
    name: 'Dev.to',
    url: "https://dev.to/haydenbleasel",
    logo: DevtoLogo,
  },
  figma: {
    name: 'Figma',
    url: "https://www.figma.com/@haydenbleasel",
    logo: FigmaLogo,
  },
  medium: {
    name: 'Medium',
    url: "https://medium.com/@haydenbleasel",
    logo: MediumLogo,
  },
};

const Home: NextPage<any> = () => {
  const [email, setEmail] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  async function joinMailingList(event: FormEvent) {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/revue", {
        method: "post",
        body: JSON.stringify({ email }),
      });

      const body = await response.json();

      if (body.error) {
        throw new Error(body.error);
      }

      toast.success('Thanks, choom! I\'ll let you know when I release something cool.');
      setEmail("");
      trackGoal(process.env.NEXT_PUBLIC_FATHOM_NEWSLETTER_GOAL!, 0);
    } catch (error: any) {
      toast.error(error?.message || 'Sorry, something went wrong! Try again later, hopefully I\'ve fixed it by then.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <NextSeo
        title="Hayden Bleasel — Chief Design Officer at Corellium"
        description="Hi, I’m Hayden Bleasel. I’m currently Chief Design Officer at Corellium where I help shape the direction of our brand and product, blurring the line between real and virtual."
        canonical={process.env.NEXT_PUBLIC_SITE_URL!}
        openGraph={{
          url: process.env.NEXT_PUBLIC_SITE_URL!,
          title: 'Hayden Bleasel',
          description: 'Hi, I’m Hayden Bleasel. I’m currently Chief Design Officer at Corellium where I help shape the direction of our brand and product, blurring the line between real and virtual.',
          images: [{
            url: `${process.env.NEXT_PUBLIC_SITE_URL!}/images/cover.jpg`,
            width: 1200,
            height: 630,
            alt: 'A spline',
            type: 'image/jpeg',
          }],
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
        url={process.env.NEXT_PUBLIC_SITE_URL!}
        sameAs={Object.values(social).map(({ url }) => url)}
      />

      <main className={styles.main}>
        <section className={styles.content}>

          <div className={styles.photo}>
            <Image src={Photo} width={48} height={48} alt="Photo of Hayden Bleasel" priority quality={100} />
          </div>

          <h1>Hi, I’m Hayden Bleasel. I’m currently Chief Design Officer at <Client {...clients.corellium} /> where I help shape the direction of our brand and product, blurring the line between real and virtual.</h1>

          <div className={styles.bio}>
            <p>I’m an Australian he/him living in Sydney. I enjoy turning complex problems into meaningful solutions through design and code. I focus on simplicity, thoughtfulness, accessibility and a learning-based approach to my work.</p>
            <p>I’ve had the privilege of working with many fantastic companies including <Client {...clients.google} />, <Client {...clients.palantir} />, <Client {...clients.nike} />, <Client {...clients.toyota} />, <Client {...clients.natgeo} />, <Client {...clients.timberland} />, <Client {...clients.canva} />, <Client {...clients.westfield} /> and <Client {...clients.ausethical} />.</p>
            <p>Previously I ran an agency called <Client {...clients.jellypepper} /> where I worked with incredible startups and projects, including <Client {...clients.clipchamp} />, <Client {...clients.baraja} />, <Client {...clients.brighte} />, <Client {...clients.spaceship} />, <Client {...clients.spacemachines} />, <Client {...clients.inventia} />, <Client {...clients.lightswap} />, <Client {...clients.airwallex} /> and <Client {...clients.eslint} />.</p>
            <p>After hours, I’m the design half of <Client {...clients.bokeh} /> — a new type of portfolio for photographers designed to showcase a meaningful body of work by going beyond likes, hashtags and scrolling.</p>
            <p>After hours, I’m working on <Client {...clients.neutral} /> — an app which so far has helped plant 1981 trees and offset 247.63 tonnes of CO₂e through 33 global reforestation programs. I also made <Client {...clients.presumi} /> — a resume analytics platform that SEEK used in Hong Kong to process 100K+ job applications and analyse 1M+ data points.</p>
            <p>In 2016, I graduated from the University of Technology, Sydney with two Bachelors degrees — Business and Information Technology. I also ocassionally take on random courses such as HarvardX’s CS50 for fun.</p>
            <p>If you want to read more about my work, check out my <Link href={social.linkedin.url}>LinkedIn</Link>. If you want to chat, DM me on <Link href={social.twitter.url}>Twitter</Link>! Or if you want to stay up to date, join my mailing list below:</p>
          </div>

          <form className={`${styles.form} ${loading ? styles.loading : ''}`} onSubmit={joinMailingList}>
            <input className={styles.input}
              name="email"
              placeholder="janesmith@acme.com"
              type="email"
              value={email}
              onChange={({ target }) => setEmail(target.value)}
            />
            <button disabled={!email} className={styles.button}>&rarr;</button>
          </form>

          <p>✌️</p>
        </section>
        <section className={styles.aside}>
          <Image src={Spline} layout="fill" alt="A spline" objectFit="contain" objectPosition="top right" quality={100} placeholder="empty" />
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
};

export default Home;
