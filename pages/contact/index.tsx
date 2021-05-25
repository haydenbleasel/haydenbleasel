import { useState } from "react";
import type { ChangeEvent, FormEvent } from 'react';
import Layout from "../../components/layout";

import styles from "./contact.module.css";
import Section from "../../components/section";
import Title from "../../components/title";

const Contact = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [files, setFiles] = useState<FileList | null>(null);
  const [loading, setLoading] = useState(false);

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

      const data = await response.json();

      if (response.status !== 200) {
        throw new Error(data.message);
      }

      window.alert("Thanks, choom! I'll be in touch soon!");

      setName("");
      setEmail("");
      setMessage("");
      setFiles(null);
    } catch (error: any) {
      window.alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Layout
      title="Get in touch"
      description="I’m always keen to have a chat and open to new opportunities."
    >
      <Section>
        <div className={styles.hero}>
          <Title sans="Get in" serif="touch" />
          <p className="paragraphSans">
            I’m always keen to have a chat and open to new opportunities. Just
            fill in the form.
          </p>
        </div>

        <form
          className={`${styles.form} ${loading ? styles.loading : ""}`}
          onSubmit={sendEmail}
        >
          <fieldset className={styles.fieldset}>
            <div className={styles.fieldHeader}>
              <label className={styles.label} htmlFor="name">
                Full name
              </label>
              <span className={styles.remaining}>
                {name.length} / 320
              </span>
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
              onChange={({ target }: ChangeEvent) =>
                setName((target as HTMLInputElement).value)
              }
            />
          </fieldset>
          <fieldset className={styles.fieldset}>
            <div className={styles.fieldHeader}>
              <label className={styles.label} htmlFor="email">
                Email address
              </label>
              <span className={styles.remaining}>
                {email.length} / 320
              </span>
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
              onChange={({ target }: ChangeEvent) =>
                setEmail((target as HTMLInputElement).value)
              }
            />
          </fieldset>
          <fieldset className={styles.fieldset}>
            <div className={styles.fieldHeader}>
              <label className={styles.label} htmlFor="message">
                Message
              </label>
              <span className={styles.remaining}>
                {message.length} / 1000
              </span>
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
              onChange={({ target }: ChangeEvent) =>
                setMessage((target as HTMLInputElement).value)
              }
            />
          </fieldset>
          <fieldset className={styles.fieldset}>
            <label className={styles.label} htmlFor="files">
              Attach files
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
            Send message
          </button>
        </form>
      </Section>
    </Layout>
  );
};

export default Contact;
