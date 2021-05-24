import Image from "next/image";
import styles from "./Client.module.css";

type ClientProps = {
  name: string;
  size?: number;
};

const Client = ({ name, size = 24 }: ClientProps) => (
  <span className={styles.client}>
    <Image
      layout="fixed"
      height={size}
      width={size}
      alt={name}
      src={`/images/companies/${name.replace(' ', '').toLowerCase()}.svg`}
      quality={100}
      objectFit="contain"
    />
    <span>{name}</span>
  </span>
);

export default Client;
