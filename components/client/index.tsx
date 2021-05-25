import Image from "next/image";
import Link from "../link";
import styles from "./client.module.css";

type ClientProps = {
  link?: string;
  name: string;
  large?: boolean;
};

const ClientInner = ({ name, large = false }: ClientProps) => (
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
    />
    <span>{name}</span>
  </span>
);

const Client = ({ link, ...props }: ClientProps) =>
  link ? (
    <Link href={link}>
      <ClientInner {...props} />
    </Link>
  ) : (
    <ClientInner {...props} />
  );

export default Client;
