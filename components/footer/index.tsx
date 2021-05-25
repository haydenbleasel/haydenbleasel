import { useState } from "react";
import type { FormEvent } from "react";
import Image from "next/image";
import styles from "./footer.module.css";
import Link from "../link";
import Section from "../section";

type IFooter = {
  socialPlatforms: {
    name: string;
    url: string;
    image: string;
  }[];
};

const Footer = ({ socialPlatforms }: IFooter) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

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
          {socialPlatforms.map(({ name, url, image }) => (
            <a
              className={styles.socialIcon}
              key={name}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                alt={name}
                layout="fixed"
                width={18}
                height={18}
                src={image}
                quality={100}
              />
            </a>
          ))}
        </div>

        <div className={styles.newsletterContainer}>
          <p>
            <span className="h1Sans">Want to chat?</span>{" "}
            <Link href="/contact">
              <span className="h1Serif underline">Get in touch.</span>
              <span className="h1Serif">&rarr;</span>
            </Link>
          </p>

          <p className="h1Sans">
            Join my private mailing list and get notified when I publish a new
            product or article.
          </p>

          <form
            id="newsletter"
            className={`${styles.newsletter} ${loading ? styles.loading : ""}`}
            onSubmit={joinMailingList}
          >
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
                &rarr;
              </button>
            </fieldset>
          </form>

          <div className={styles.copyright}>
            <p className="small">
              <span>&copy; Hayden Bleasel 2077.</span>
              <span>
                {" "}
                <Link href="https://github.com/haydenbleasel/website">
                  Source code
                </Link>
                .
              </span>
            </p>
          </div>
        </div>
      </Section>
    </footer>
  );
};

export default Footer;
