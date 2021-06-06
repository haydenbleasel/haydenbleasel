import { richtext } from "../../utils/prismic";
import Section from "../section";
import styles from "./title.module.css";

type ITitle = {
  title: PrismicRichText | string;
};

const Title = ({ title }: ITitle) => (
  <Section style={{ paddingBottom: 0 }}>
    <div className={styles.container}>
      {typeof title === 'object' ? (
        <h1 className="titleSans" dangerouslySetInnerHTML={{ __html: richtext(title, true) }} />
      ) : (
        <h1 className="titleSans">{title}</h1>
      )}
    </div>
  </Section>
);

export default Title;
