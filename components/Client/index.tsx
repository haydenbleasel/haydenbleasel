import Image from "next/image";
import styles from "./Client.module.css";

type ClientProps = {
  name: string;
};

const Client = ({ name }: ClientProps) => (
  <div className={styles.client}>
    <Image
      layout="fixed"
      height={32}
      width={32}
      alt={name}
      src={`/images/companies/${name.replace(' ', '').toLowerCase()}.svg`}
      quality={100}
      objectFit="contain"
    />
    <span>{name}</span>
  </div>
);

export default Client;
