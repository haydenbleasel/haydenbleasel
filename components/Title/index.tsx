import Section from '../Section';
import styles from './title.module.css';

type ITitle = {
  sans: string;
  serif: string;
}

const Title = ({ sans, serif }: ITitle) => (
  <Section style={{ paddingBottom: 0, paddingTop: '12vw', marginBottom: '-3vw' }}>
    <h1 className={styles.title}>
      <span className="titleSans">{sans}</span>
      <span className="titleSerif">&nbsp;{serif}</span>
    </h1>
  </Section>
);

export default Title;