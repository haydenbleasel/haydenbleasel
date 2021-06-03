import { richtext } from "../../utils/prismic";
import Section from "../section";
import styles from "./title.module.css";

type ITitle = {
  title: PrismicRichText;
};

const Title = ({ title }: ITitle) => (
  <Section style={{ paddingBottom: 0 }}>
    <div className={styles.container}>
      <h1 className="titleSans" dangerouslySetInnerHTML={{ __html: richtext(title, true) }} />
    </div>
  </Section>
);

export default Title;
