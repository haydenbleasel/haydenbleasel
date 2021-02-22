import { useState } from 'react';
import { Fade } from 'react-awesome-reveal';
import SpotifyWebApi from 'spotify-web-api-node';
import Layout from '../../components/Layout';
import Hero from '../../components/Hero';
import Feature from '../../components/Feature';
import he from 'he';
import ColorThief from 'colorthief';
import Contrast from 'get-contrast';
import { siteUrl } from '../../next-sitemap';
import ArrowLink from '../../components/ArrowLink';
import styles from './Playlists.module.css';

type SpotifyPlaylist = {
    description: string,
    external_urls: any,
    id: string,
    images: any,
    name: string,
    tracks: any,
}

type PlaylistsProps = {
    playlists: SpotifyPlaylist[],
}

function getColor(image: HTMLImageElement) {
    const colorThief = new ColorThief();
    const palette = colorThief.getPalette(image, 8) || [];
    const backgroundColor = window.matchMedia('(prefers-color-scheme: dark)').matches ? '#0C0D15' : '#FFFFFF';

    const colors = palette.filter((color) => (
        Contrast.isAccessible(backgroundColor, `rgb(${color.join(',')})`)
    )).sort((a, b) => {
        const ratioA = Contrast.ratio(backgroundColor, `rgb(${a.join(',')})`);
        const ratioB = Contrast.ratio(backgroundColor, `rgb(${b.join(',')})`);

        return ratioA > ratioB ? 1 : -1;
    });

    return colors[0];
}

function Playlist({ description, external_urls, id, images, name, tracks }: SpotifyPlaylist, index) {
    const [color, setColor] = useState('var(--black)');

    function getDominantColor(event: any) {
        event.persist();
        
        const dominantColor = getColor(event.target);

        if (dominantColor) {
            setColor(`rgba(${dominantColor.join(',')})`);
        }
    }

    return (
        <div key={id}>
            <Fade triggerOnce delay={index ? 0 : 800}>
                <Feature
                    image={images[0].url}
                    title={name}
                    description={he.decode(description)}
                    caption={`${tracks.total} tracks`}
                    reverse={!(index % 2)}
                    onImageLoad={getDominantColor}
                    imageProps={{ height: 630 }}
                >
                    <ArrowLink href={external_urls.spotify} color={color}>Listen on Spotify</ArrowLink>
                </Feature>
            </Fade>
        </div>
    );
}

const Playlists = ({ playlists }: PlaylistsProps) => (
    <Layout
        title="Curated Spotify playlists"
        description="Some playlists I’ve put together, for work or play. Check them out on Spotify."
        image={{
            url: `${siteUrl}/images/playlists/playlists.png`,
            width: 1440,
            height: 900,
        }}
    >

        <Hero
            title="Playlists"
            description="Some playlists I’ve put together, for work or play. Check them out on Spotify."
        />

        <div className={styles.playlists}>
            {playlists.map(Playlist)}
        </div>
    
    </Layout>
);

export async function getStaticProps() {
    const spotifyApi = new SpotifyWebApi({
        clientId: process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID,
        clientSecret: process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET,
    });

    const data = await spotifyApi.clientCredentialsGrant();

    spotifyApi.setAccessToken(data.body.access_token);
  
    const { body } = await spotifyApi.getUserPlaylists('haydenbleasel');

    return {
        props: {
            playlists: body.items,
        },
    }
}

export default Playlists;