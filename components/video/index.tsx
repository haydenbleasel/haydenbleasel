import ReactPlayer from 'react-player/vimeo';
import styles from './video.module.css';

export default function Video({ embed_url }: PrismicVideo) {
  return (
    <div className={styles.video}>
      <ReactPlayer
        url={embed_url}
        playing
        muted
        loop
        playsinline
        width="100%"
        height="100%"
        config={{
          playerOptions: {
            background: true
          }
        }}
        />
    </div>
  );
}
