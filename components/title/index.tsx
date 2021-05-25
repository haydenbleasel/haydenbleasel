import Section from "../section";
import styles from "./title.module.css";

type ITitle = {
  sans: string;
  serif: string;
};

const Title = ({ sans, serif }: ITitle) => (
  <Section
    style={{
      paddingBottom: 0,
      paddingTop: "var(--gap-huge)",
      marginBottom: "var(--gap-medium)",
    }}
  >
    <h1 className={styles.title}>
      <span className="titleSans">{sans}</span>
      <span className="titleSerif">&nbsp;{serif}</span>
    </h1>
  </Section>
);

export default Title;
