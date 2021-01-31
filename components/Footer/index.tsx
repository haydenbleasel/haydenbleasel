import React, { FormEvent, useState } from 'react';
import Image from 'next/image';
import { Notyf } from 'notyf';
import Fade from 'react-reveal/Fade';
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
                message: 'Thanks, choom. Check your email for a confirmation.',
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
            <form className={`${styles.newsletter} ${loading ? styles.loading : ''}`} onSubmit={joinMailingList}>
                <Fade>
                    <Image
                        layout="fixed"
                        width={27}
                        height={27}
                        src="/images/newsletter.svg"
                        alt="Newsletter"
                        quality={100}
                    />
                </Fade>
                <Fade delay={200}>
                    <p className={styles.newsletterHeading}>Join my private mailing list and get notified when I publish a new product or article.</p>
                </Fade>
                <Fade delay={400}>
                    <fieldset className={styles.newsletterFields}>
                        <label className={styles.label} htmlFor="email">Email address</label>
                        <input
                            required
                            id="email"
                            className={styles.newsletterInput}
                            type="email"
                            placeholder="janesmith@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)} />
                        <button aria-label="Sign up" type="submit" className={styles.newsletterButton}>
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
                        <Fade delay={index * 100}>
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
            <Fade>
                <small className={styles.copyright}>
                    <span>&copy; Hayden Bleasel 2077. </span>
                    <span><Link href="https://github.com/haydenbleasel/website">Source code</Link>.</span>
                </small>
            </Fade>
        </footer>
    );
}

export default Footer;