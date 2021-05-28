import Image from "next/image";
import Link from "../link";
import styles from "./client.module.css";

type IClient = {
  link: string;
  name: string;
  large?: boolean;
};

const Client = ({ link, large = false, name }: IClient) => (
  <Link href={link}>
    <span className={`${styles.client} ${large ? styles.large : ""}`}>
      <Image
        layout="fixed"
        height={large ? 32 : 24}
        width={large ? 32 : 24}
        alt={name}
        src={`/images/companies/${name
          .replace(" ", "")
          .replace("/", "")
          .toLowerCase()}.svg`}
        quality={100}
        objectFit="contain"
        priority={large}
      />
      <span>{name}</span>
    </span>
  </Link>
);

export default Client;
