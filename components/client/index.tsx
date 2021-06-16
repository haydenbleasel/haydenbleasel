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
  return (
    <Link href={element.data} className={styles.client}>
      <Image
        layout="fixed"
        height={32}
        width={32}
        alt={content}
        src={`/images/${content
          .replace(" ", "")
          .replace("/", "")
          .toLowerCase()}.svg`}
        quality={100}
        objectFit="contain"
        priority
      />&nbsp;
      <span className={styles.clientName}>{content}</span>
    </Link>
  );
}

export default Client;
