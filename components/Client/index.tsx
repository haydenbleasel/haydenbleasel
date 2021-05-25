import Image from "next/image";
import styles from "./Client.module.css";

type ClientProps = {
  name: string;
  large?: boolean;
};

const Client = ({ name, large = false }: ClientProps) => (
  <span className={`${styles.client} ${large ? styles.large :''}`}>
    <Image
      layout="fixed"
      height={large ? 32 : 24}
      width={large ? 32 : 24}
      alt={name}
      src={`/images/companies/${name.replace(' ', '').replace('/', '').toLowerCase()}.svg`}
      quality={100}
      objectFit="contain"
    />
    <span>{name}</span>
  </span>
);

export default Client;
