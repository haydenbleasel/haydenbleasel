import Link from "../link";
import styles from "./client.module.css";

type IClient = {
  link?: string;
  image: string;
  name: string;
  large?: boolean;
};

const ClientInner = ({ image, name, large = false }: IClient) => {
  const Image = image;

  return (
    <span className={`${styles.client} ${large ? styles.large : ""}`}>
      <Image />
      <span>{name}</span>
    </span>
  );
}

const Client = ({ link, ...props }: IClient) =>
  link ? (
    <Link href={link}>
      <ClientInner {...props} />
    </Link>
  ) : (
    <ClientInner {...props} />
  );

export default Client;
