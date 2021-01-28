import React, { FormEvent, useState } from 'react';
import Image from 'next/image';
import { Notyf } from 'notyf';

import styles from './Footer.module.css';
import ArrowLink from '../ArrowLink';

const Footer = ({ socialPlatforms }) => {

    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    
    async function joinMailingList(event: FormEvent) {
        event.preventDefault();
        setLoading(true);

        const response = await fetch('/api/revue', {
            method: 'post',
            body: JSON.stringify({ email }),
        });

        const body = await response.json();
        const notyf = new Notyf();

        if (body.success) {
            notyf.success({
                message: 'Thanks, choom. Check your email for a confirmation.',
                duration: 5000,
                icon: false,
            });
        } else {
            notyf.error({
                message: 'Sorry, something went wrong.',
                duration: 5000,
                icon: false,
            });
        }

        setLoading(false);
        setEmail('');
    }

    return (
        <footer className={styles.footer}>
            <form className={`${styles.newsletter} ${loading ? styles.loading : ''}`} onSubmit={joinMailingList}>
                <Image
                    layout="fixed"
                    width={20}
                    height={20}
                    src="/images/newsletter.svg"
                    alt="Newsletter"
                />
                <p className={styles.newsletterHeading}>Join my private mailing list and get notified when I publish a new product or article.</p>
                <fieldset className={styles.newsletterFields}>
                    <input
                        required
                        className={styles.newsletterInput}
                        type="email"
                        placeholder="janesmith@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)} />
                    <button type="submit" className={styles.newsletterButton}>
                        <ArrowLink />
                    </button>
                </fieldset>
            </form>
            <div className={styles.social}>
                {socialPlatforms.map((platform) => (
                    <a
                        className={styles.socialIcon}
                        key={platform.name}
                        href={platform.url}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <Image
                            alt={platform.name}
                            layout="fixed"
                            width={16}
                            height={16}
                            src={platform.image}
                        />
                    </a>
                ))}
            </div>
            <small className={styles.copyright}>&copy; Hayden Bleasel 2077</small>
        </footer>
    );
}

export default Footer;