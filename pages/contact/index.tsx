import type { GetStaticProps, NextPage } from 'next';
import { useRef, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import classNames from 'classnames/bind';
import toast from 'react-hot-toast';
import { trackGoal } from 'fathom-client';
import { useDrop } from 'react-use';
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
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const fileInput = useRef<HTMLInputElement>(null);
  const dropState = useDrop({
    onFiles: addFiles,
    onUri: () => toast.error('Files only please!'),
    onText: () => toast.error('Files only please!'),
  });

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
      files.map((file, index) =>
        formData.append(`file${index}`, file)
      );

      const response = await fetch("/api/nodemailer", {
        method: "post",
        body: formData,
      });

      const responseData = await response.json();

      if (responseData.error) {
        throw new Error(responseData.error);
      }

      toast.success(data.success_alert);

      setName("");
      setEmail("");
      setMessage("");
      setFiles([]);
      
      trackGoal(process.env.NEXT_PUBLIC_FATHOM_CONTACT_GOAL!, 0);
    } catch (error) {
      toast.error(error.message || data.error_alert);
    } finally {
      setLoading(false);
    }
  }

  function addFiles(newFiles: File[]) {
    newFiles.forEach((file, index) => {
      const fileExists = files.some(({ name, size }) => name === file.name && size === file.size);

      if (fileExists) {
        toast.error(`You already uploaded ${file.name}`);
        newFiles.splice(index);
      }

      if (file.size > 5000000) {
        toast.error(`${file.name} is too chonky (5MB max file size).`);
        newFiles.splice(index);
      }

    });

    setFiles([...files, ...newFiles]);
  }

  function onChangeFiles({ target }: ChangeEvent<HTMLInputElement>) {
    if (target.files) {
      const newFiles = Array.from(target.files);

      addFiles(newFiles);
    }
  }

  function clickFiles() {
    fileInput.current?.click();
  }

  function removeFile(index: number) {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
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

          <div className={styles.available}>
            <div className={cx('dot', { active: settings.available_for_hire })} />
            <p className={styles.dotText}>Currently {settings.available_for_hire ? 'available' : 'unavailable'} for work</p>
          </div>
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
              value={[]}
              ref={fileInput}
              hidden
              id="files"
              name="files"
              type="file"
              multiple
              onChange={onChangeFiles}
            />
            <div className={styles.files} onClick={clickFiles}>
              Upload files
            </div>
            <div className={styles.fileList}>
              {files.map((file, index) => (
                <div className={styles.file} key={file.name}>
                  <span>{file.name} ({(file.size / 1024).toFixed(2)}kb)</span>
                  <span className={styles.remove} onClick={() => removeFile(index)}>&times;</span>
                </div>
              ))}
            </div>
          </fieldset>

          <button className={styles.button} type="submit">
            {data.form_button_text}
          </button>
        </form>
      </Section>

      <div className={cx('dropzone', { active: dropState.over })} />
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
