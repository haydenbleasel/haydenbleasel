import { FormEvent, useState } from 'react';
import Image from 'next/image';
import { Notyf } from 'notyf';
import { Fade } from 'react-awesome-reveal';
import styles from './Footer.module.css';
import ArrowLink from '../ArrowLink';
import Link from '../Link';

const Footer = ({ socialPlatforms }) => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    
    async function joinMailingList(event: FormEvent) {
        event.preventDefault();
        setLoading(true);

        const notyf = new Notyf();

        try {
            const response = await fetch('/api/revue', {
                method: 'post',
                body: JSON.stringify({ email }),
            });

            const body = await response.json();

            if (!body.success) {
                throw new Error();
            }
            
            notyf.success({
                message: 'Thanks, choom. I\'ll let you know when I release something cool.',
                duration: 5000,
                icon: false,
            });
            
            setEmail('');
        } catch (error: any) {
            notyf.error({
                message: 'Sorry, something went wrong.',
                duration: 5000,
                icon: false,
            });
        } finally {
            setLoading(false);
        }
    }

    return (
      <footer className={styles.footer}>
        <p>
          <span className="h1Sans">Want to chat?</span>{" "}
          <span className="h1Serif">Get in touch.</span>
        </p>

        <form
          id="newsletter"
          className={`${styles.newsletter} ${loading ? styles.loading : ""}`}
          onSubmit={joinMailingList}
        >
          <Fade triggerOnce delay={200}>
            <p className="h1Sans">
              Join my private mailing list and get notified when I publish a new
              product or article.
            </p>
          </Fade>
          <Fade triggerOnce delay={400}>
            <fieldset className={styles.newsletterFields}>
              <label className={styles.label} htmlFor="email">
                Email address
              </label>
              <input
                required
                id="email"
                className={styles.input}
                type="email"
                placeholder="janesmith@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button
                aria-label="Sign up"
                type="submit"
                className={styles.newsletterButton}
              >
                <ArrowLink />
              </button>
            </fieldset>
          </Fade>
        </form>
        <div className={styles.social}>
          {socialPlatforms.map((platform, index) => (
            <a
              className={styles.socialIcon}
              key={platform.name}
              href={platform.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Fade triggerOnce delay={index * 100}>
                <Image
                  alt={platform.name}
                  layout="fixed"
                  width={18}
                  height={18}
                  src={platform.image}
                  quality={100}
                />
              </Fade>
            </a>
          ))}
        </div>
        <Fade triggerOnce>
          <small className={styles.copyright}>
            <span>&copy; Hayden Bleasel 2077. </span>
            <span>
              <Link href="https://github.com/haydenbleasel/website">
                Source code
              </Link>
              .
            </span>
          </small>
        </Fade>
      </footer>
    );
}

export default Footer;