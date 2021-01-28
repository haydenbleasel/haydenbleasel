import React, { ChangeEvent, FormEvent, useState } from 'react';
import Layout from '../../components/Layout';
import Hero from '../../components/Hero';

import styles from './Contact.module.css';

const Events = () => {

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    async function sendEmail(event: FormEvent) {
        event.preventDefault();

        setLoading(true);

        try {

            const response = await fetch('/api/nodemailer', {
                method: 'post',
                body: JSON.stringify({ name, email, message }),
            });

            const body = await response.json();

            console.log(body, 'body');

        } catch (error: Error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <Layout
            title="Get in touch"
            description="I’m always keen to have a chat and open to new opportunities."
        >

            <Hero
                title="Get in touch"
                description="I’m always keen to have a chat and open to new opportunities. Just fill in the form below."
            />

            <form className={`${styles.form} ${loading ? styles.loading : ''}`} onSubmit={sendEmail}>
                <fieldset className={styles.fieldset}>
                    <div className={styles.fieldHeader}>
                        <label className={styles.label} htmlFor="name">Full name</label>
                        <span className={styles.remaining}>{320 - name.length}</span>
                    </div>
                    <input
                        className={styles.input}
                        id="name"
                        name="name"
                        type="text"
                        placeholder="Jane Smith"
                        required
                        autoComplete="on"
                        value={name}
                        maxLength={320}
                        onChange={({ target }: ChangeEvent) => (
                            setName((target as HTMLInputElement).value)
                        )}
                    />
                </fieldset>
                <fieldset className={styles.fieldset}>
                    <div className={styles.fieldHeader}>
                        <label className={styles.label} htmlFor="email">Email address</label>
                        <span className={styles.remaining}>{320 - email.length}</span>
                    </div>
                    <input
                        className={styles.input}
                        id="email"
                        name="email"
                        type="email"
                        placeholder="janesmith@example.com"
                        required
                        autoComplete="on"
                        value={email}
                        maxLength={320}
                        onChange={({ target }: ChangeEvent) => (
                            setEmail((target as HTMLInputElement).value)
                        )}
                    />
                </fieldset>
                <fieldset className={styles.fieldset}>
                    <div className={styles.fieldHeader}>
                        <label className={styles.label} htmlFor="message">Message</label>
                        <span className={styles.remaining}>{1000 - message.length}</span>
                    </div>
                    <textarea
                        className={styles.textarea}
                        id="message"
                        name="message"
                        placeholder="Hey Hayden, I’m interested in chatting about a new role we have available..."
                        required
                        autoComplete="off"
                        value={message}
                        maxLength={1000}
                        onChange={({ target }: ChangeEvent) => (
                            setMessage((target as HTMLInputElement).value)
                        )}
                    />
                </fieldset>
                <fieldset className={styles.fieldset}>
                    <label className={styles.label} htmlFor="files">Attach files
                        <span> (Optional)</span>
                    </label>
                    <input
                        className={styles.files}
                        id="files"
                        name="files"
                        type="file"
                        multiple
                    />
                </fieldset>

                <button className={styles.button} type="submit">Send message</button>
            </form>

        </Layout>
    );
}

export default Events;