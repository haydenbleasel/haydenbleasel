import type { GetStaticProps, NextPage } from 'next';
import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import classNames from 'classnames/bind';
import { trackGoal } from 'fathom-client';
import Layout from "../../components/layout";
import styles from "./contact.module.css";
import Section from "../../components/section";
import Title from "../../components/title";
import { queryAt, richtext } from "../../utils/prismic";

type IContact = {
  data: {
    title: string;
    description: string;
    hero_title: PrismicRichText;
    hero_description: PrismicRichText;
    form_name_label: string;
    form_name_placeholder: string;
    form_email_label: string;
    form_email_placeholder: string;
    form_message_label: string;
    form_message_placeholder: string;
    form_files_label: string;
    form_button_text: string;
    success_alert: string;
    error_alert: string;
  };
  settings: PrismicSettings;
}

const cx = classNames.bind(styles);

const Contact: NextPage<IContact> = ({ data, settings }) => {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [files, setFiles] = useState<FileList | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  async function sendEmail(event: FormEvent) {
    event.preventDefault();

    setLoading(true);

    try {
      const formData = new FormData();

      if (!name.trim()) {
        throw new Error("Please provide a valid name.");
      }

      if (!email.trim()) {
        throw new Error("Please provide a valid email address.");
      }

      if (!message.trim()) {
        throw new Error("Please provide a valid message.");
      }

      formData.append("name", name);
      formData.append("email", email);
      formData.append("message", message);

      if (files) {
        Array.from(files).map((file, index) =>
          formData.append(`file${index}`, file)
        );
      }

      const response = await fetch("/api/nodemailer", {
        method: "post",
        body: formData,
      });

      const responseData = await response.json();

      if (responseData.error) {
        throw new Error(responseData.error);
      }

      window.alert(data.success_alert);

      setName("");
      setEmail("");
      setMessage("");
      setFiles(null);
      
      trackGoal(process.env.NEXT_PUBLIC_FATHOM_CONTACT_GOAL!, 0);
    } catch (error) {
      window.alert(error.message || data.error_alert);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Layout
      title={data.title}
      description={data.description}
      settings={settings}
    >
      <Section>
        <div className={styles.hero}>
          <Title title={data.hero_title} />
          <p className="paragraphSans" dangerouslySetInnerHTML={{ __html: richtext(data.hero_description, true) }} />
        </div>

        <form
          className={cx('form', { loading })}
          onSubmit={sendEmail}
        >
          <fieldset className={styles.fieldset}>
            <div className={styles.fieldHeader}>
              <label className={styles.label} htmlFor="name">
                {data.form_name_label}
              </label>
              <span className={styles.remaining}>{name.length} / 320</span>
            </div>
            <input
              className={styles.input}
              id="name"
              name="name"
              type="text"
              placeholder={data.form_name_placeholder}
              required
              autoComplete="on"
              value={name}
              maxLength={320}
              onChange={({ target }: ChangeEvent) =>
                setName((target as HTMLInputElement).value)
              }
            />
          </fieldset>
          <fieldset className={styles.fieldset}>
            <div className={styles.fieldHeader}>
              <label className={styles.label} htmlFor="email">
                {data.form_email_label}
              </label>
              <span className={styles.remaining}>{email.length} / 320</span>
            </div>
            <input
              className={styles.input}
              id="email"
              name="email"
              type="email"
              placeholder={data.form_email_placeholder}
              required
              autoComplete="on"
              value={email}
              pattern=".+@.+\..+"
              maxLength={320}
              onChange={({ target }: ChangeEvent) =>
                setEmail((target as HTMLInputElement).value)
              }
            />
          </fieldset>
          <fieldset className={styles.fieldset}>
            <div className={styles.fieldHeader}>
              <label className={styles.label} htmlFor="message">
                {data.form_message_label}
              </label>
              <span className={styles.remaining}>{message.length} / 1000</span>
            </div>
            <textarea
              className={styles.textarea}
              id="message"
              name="message"
              placeholder={data.form_email_placeholder}
              required
              autoComplete="off"
              value={message}
              maxLength={1000}
              onChange={({ target }: ChangeEvent) =>
                setMessage((target as HTMLInputElement).value)
              }
            />
          </fieldset>
          <fieldset className={styles.fieldset}>
            <label className={styles.label} htmlFor="files">
              {data.form_files_label}
              <span> (Optional)</span>
            </label>
            <input
              className={styles.files}
              id="files"
              name="files"
              type="file"
              multiple
              onChange={({ target }: ChangeEvent) =>
                setFiles((target as HTMLInputElement).files)
              }
            />
          </fieldset>

          <button className={styles.button} type="submit">
            {data.form_button_text}
          </button>
        </form>
      </Section>
    </Layout>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const { data } = await queryAt('document.type', 'contact');
  const { data: settings } = await queryAt('document.type', 'settings');

  return {
    props: {
      data,
      settings,
    },
  };
}

export default Contact;
