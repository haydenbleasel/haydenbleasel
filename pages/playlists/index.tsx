import Layout from "../../components/layout";
import Card from "../../components/card";
import Title from "../../components/title";
import Link from "../../components/link";
import { queryAt } from "../../utils/prismic";
import styles from "./playlists.module.css";
import { getPlaylists } from "../../utils/spotify";
import Section from "../../components/section";

type SpotifyPlaylist = {
  id: string;
  name: string;
  description: string;
  url: string;
  image: string;
  tracks: number;
  duration: number;
  artists: string;
};

type IPlaylists = {
  data: {
    title: string;
    description: string;
    hero_title: PrismicRichText;
    action_cta: string;
  }
  playlists: SpotifyPlaylist[];
  settings: PrismicSettings;
};

function Playlist({
  id,
  name,
  url,
  image,
  tracks,
  duration,
  artists,
}: SpotifyPlaylist) {
  return (
    <Link className={styles.playlist} key={id} href={url}>
      <Card
        id={id}
        caption={`${tracks} tracks · ${(duration / 3600000).toFixed(1)} hours`}
        image={{
          url: image,
          alt: name,
          dimensions: {
            width: 640,
            height: 640,
          }
        }}
        width={640}
        height={640}
        title={name}
      >
        {artists}
      </Card>
    </Link>
  )
}

const Playlists = ({ data, playlists, settings }: IPlaylists) => (
  <Layout
    title={data.title}
    description={data.description}
    settings={settings}
  >
    <Title title={data.hero_title} />
    <Section>
      <div className={styles.playlists}>
        {playlists.map(Playlist)}
      </div>
    </Section>
  </Layout>
);

export async function getStaticProps() {
  const { data } = await queryAt('document.type', 'playlists');
  const { data: settings } = await queryAt('document.type', 'settings');
  const playlists = await getPlaylists();

  return {
    props: {
      data,
      playlists,
      settings,
    },
  };
}

export default Playlists;
