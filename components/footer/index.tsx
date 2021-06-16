import { useState } from "react";
import type { FormEvent } from "react";
import Image from "next/image";
import { trackGoal } from "fathom-client";
import styles from "./footer.module.css";
import Link from "../link";
import Section from "../section";
import { richtext } from "../../utils/prismic";
import Form from "../form";

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

      if (body.error) {
        throw new Error(body.error);
      }

      window.alert(settings.newsletter_success_alert);
      setEmail("");
      trackGoal(process.env.NEXT_PUBLIC_FATHOM_NEWSLETTER_GOAL!, 0);
    } catch (error: any) {
      window.alert(error.message || settings.newsletter_error_alert);
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

          <div className={styles.copyright}>
            <p className="small" dangerouslySetInnerHTML={{__html: richtext(settings.footer_disclaimer, true) }} />
          </div>
        </div>
      </Section>
    </footer>
  );
};

export default Footer;
