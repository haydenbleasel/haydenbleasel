import type { GetStaticProps, NextPage } from 'next';
import classNames from 'classnames/bind';
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
  };
  settings: PrismicSettings;
}

const cx = classNames.bind(styles);

const Contact: NextPage<IContact> = ({ data, settings }) => {
  return (
    <Layout title={data.title} description={data.description} settings={settings}>
      <div className={styles.title}>
        <Title title={data.hero_title} />
      </div>
      <Section style={{ paddingTop: 0 }}>
        <div className={styles.content}>
          <p className="paragraphSans" dangerouslySetInnerHTML={{ __html: richtext(data.hero_description, true) }} />

          <div className={styles.available}>
            <div className={cx('dot', { active: settings.available_for_hire })} />
            <p className={styles.dotText}>Currently {settings.available_for_hire ? 'available' : 'unavailable'} for work</p>
          </div>
        </div>
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
