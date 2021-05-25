import styles from "./divider.module.css";

type IDivider = {
  text: string;
}

const Divider = ({ text }: IDivider) => (
  <div className={styles.divider}>
    <h2 className="small grey">{text}</h2>
  </div>
);

export default Divider;
