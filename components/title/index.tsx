import Section from "../section";
import styles from "./title.module.css";

type ITitle = {
  sans: string;
  serif: string;
};

const Title = ({ sans, serif }: ITitle) => (
  <Section style={{ paddingBottom: 0 }}>
    <div className={styles.container}>
      <h1 className={styles.title}>
        <span className="titleSans">{sans}</span>
        <span className="titleSerif">&nbsp;{serif}</span>
      </h1>
    </div>
  </Section>
);

export default Title;
