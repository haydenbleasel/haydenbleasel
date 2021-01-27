import React, { useState } from 'react';
import Layout from '../../components/Layout';
import Hero from '../../components/Hero';
import Feature from '../../components/Feature';
import SpotifyWebApi from 'spotify-web-api-node';
import he from 'he';
import ColorThief from 'colorthief';
import Contrast from 'get-contrast';

import ArrowLink from '../../components/ArrowLink';
import styles from './Playlists.module.css';

function getColor(image: HTMLImageElement) {
    const colorThief = new ColorThief();
    const palette = colorThief.getPalette(image, 8) || [];

    const colors = palette.filter((color) => (
        Contrast.isAccessible('#FFFFFF', `rgb(${color.join(',')})`)
    )).sort((a, b) => {
        const ratioA = Contrast.ratio('#FFFFFF', `rgb(${a.join(',')})`);
        const ratioB = Contrast.ratio('#FFFFFF', `rgb(${b.join(',')})`);

        return ratioA > ratioB ? 1 : -1;
    });

    return colors[0];
}

function Playlist({ description, external_urls, id, images, name, tracks }, i) {
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
            <Feature
                image={images[0].url}
                title={name}
                description={he.decode(description)}
                caption={`${tracks.total} tracks`}
                reverse={!(i % 2)}
                onImageLoad={getDominantColor}
            >
                <a href={external_urls.spotify} rel="noopener noreferrer">
                    <ArrowLink color={color}>Listen on Spotify</ArrowLink>
                </a>
            </Feature>
        </div>
    );
}

const Playlists = ({ playlists }) => (
    <Layout title="Playlists | Next.js + TypeScript Example">

        <Hero
            title="Playlists"
            description="Some of Spotify playlists I’ve put together, for work or play."
        />

        <div className={styles.playlists}>
            {playlists.map((Playlist))}
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