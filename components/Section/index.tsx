import styles from './section.module.css';

const Section = (props: any) => (
  <section className={styles.grid} {...props} />
);

export default Section;