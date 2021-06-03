import { useState } from "react";
import type { FormEvent } from "react";
import Image from "next/image";
import styles from "./footer.module.css";
import Link from "../link";
import Section from "../section";
import { richtext } from "../../utils/prismic";

type IFooter = {
  settings: PrismicSettings;
};

const Footer = ({ settings }: IFooter) => {
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

      if (!body.success) {
        throw new Error();
      }

      window.alert("Thanks, choom! I'll let you know when I release something cool.");
      setEmail("");
    } catch (error: any) {
      window.alert("Sorry, something went wrong! Try again later, hopefully I've fixed it");
    } finally {
      setLoading(false);
    }
  }

  return (
    <footer className={styles.footer}>
      <Section>
        <div className={styles.social}>
          {settings.social.map(({ social_name, social_link, social_icon }) => (
            <div key={social_name} className={styles.socialIcon}>
              <Link href={social_link}>
                <Image
                  alt={social_name}
                  layout="fixed"
                  width={18}
                  height={18}
                  src={social_icon.url}
                  quality={100}
                />
              </Link>
            </div>
          ))}
        </div>

        <div className={styles.container}>
          <div className="h1Sans" dangerouslySetInnerHTML={{ __html: richtext(settings.footer_content) }} />

          <form
            id="newsletter"
            className={`${styles.newsletter} ${loading ? styles.loading : ""}`}
            onSubmit={joinMailingList}
          >
            <fieldset className={styles.fields}>
              <label className={styles.label} htmlFor="email">
                {settings.footer_newsletter_label}
              </label>
              <input
                required
                id="email"
                className={styles.input}
                type="email"
                placeholder={settings.footer_newsletter_placeholder}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button
                aria-label="Sign up"
                type="submit"
                className={styles.button}
              >
                &rarr;
              </button>
            </fieldset>
          </form>

          <div className={styles.copyright}>
            <p className="small" dangerouslySetInnerHTML={{__html: richtext(settings.footer_disclaimer, true) }} />
          </div>
        </div>
      </Section>
    </footer>
  );
};

export default Footer;
