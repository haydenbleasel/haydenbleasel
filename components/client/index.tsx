import Image from "next/image";
import Link from "../link";
import styles from "./client.module.css";

type IClient = {
  element: {
    data: PrismicLink;
  };
  content: string;
};

const Client = ({ element, content }: IClient) => {
  const filename = content.replace(/ /g, "").replace(/\//g, "").toLowerCase();
  const logo = require(`./logos/${filename}.svg`);

  return (
    <div className={styles.clientWrapper}>
      <Link href={element.data} className={styles.client}>
        <Image
          layout="fixed"
          height={32}
          width={32}
          alt={content}
          src={logo}
          quality={100}
          objectFit="contain"
          priority
        />&nbsp;
        <span className={styles.clientName}>{content}</span>
      </Link>
    </div>
  );
}

export default Client;
