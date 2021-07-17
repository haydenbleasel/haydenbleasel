import { useState, useEffect } from "react";
import type { FormEvent } from "react";
import { useLocalStorage } from 'react-use';
import { trackGoal } from "fathom-client";
import toast from 'react-hot-toast';
import styles from "./footer.module.css";
import Link from "../link";
import Section from "../section";
import PrismicImage from "../prismicImage";
import { richtext } from "../../utils/prismic";
import Form from "../form";

type IFooter = {
  settings: PrismicSettings;
};

enum ITheme {
  AUTO = "auto",
  LIGHT = "light",
  DARK = "dark",
}

const Footer = ({ settings }: IFooter) => {
  const [email, setEmail] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [savedTheme, setSavedTheme, removeSavedTheme] = useLocalStorage<ITheme>('theme');
  const [theme, setTheme] = useState<ITheme>(savedTheme || ITheme.AUTO);

  useEffect(() => {
    document.body.className = document.body.className.replace(ITheme.AUTO, "");
    document.body.className = document.body.className.replace(ITheme.LIGHT, "");
    document.body.className = document.body.className.replace(ITheme.DARK, "");
    
    if (theme === ITheme.AUTO) {
      removeSavedTheme();
    } else {
      document.body.className += theme;
      setSavedTheme(theme);
    }
  }, [theme, setSavedTheme, removeSavedTheme]);

  async function joinMailingList(event: FormEvent) {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/revue", {
        method: "post",
        body: JSON.stringify({ email }),
      });

      const body = await response.json();

      if (body.error) {
        throw new Error(body.error);
      }

      toast.success(settings.newsletter_success_alert);
      setEmail("");
      trackGoal(process.env.NEXT_PUBLIC_FATHOM_NEWSLETTER_GOAL!, 0);
    } catch (error) {
      toast.error(error.message || settings.newsletter_error_alert);
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
                <PrismicImage
                  src={social_icon}
                  alt={social_name}
                  layout="fixed"
                  width={18}
                  height={18}
                />
              </Link>
            </div>
          ))}
        </div>

        <div className={styles.container}>
          <div className="h1Sans" dangerouslySetInnerHTML={{ __html: richtext(settings.footer_content) }} />

          <Form
            name="email"
            label={settings.footer_newsletter_label}
            placeholder={settings.footer_newsletter_placeholder}
            type="email"
            value={email}
            onChangeText={setEmail}
            loading={loading}
            onSubmit={joinMailingList}
            pattern=".+@.+\..+"
          />
        </div>
        <div className={styles.footerLower}>
            <div className={styles.copyright}>
              <p className="smallSans" dangerouslySetInnerHTML={{__html: richtext(settings.footer_disclaimer, true) }} />
            </div>
            <select value={theme} className={styles.select} onChange={({ target }) => setTheme(target.value as ITheme)}>
              <option value={ITheme.AUTO}>🌗 System Default</option>
              <option value={ITheme.LIGHT}>☀️ Light</option>
              <option value={ITheme.DARK}>🌑 Dark</option>
            </select>
          </div>
      </Section>
    </footer>
  );
};

export default Footer;
