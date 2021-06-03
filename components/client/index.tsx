import Image from "next/image";
import Link from "../link";
import styles from "./client.module.css";

type IClient = {
  element: {
    data: PrismicLink;
  };
  content: string;
  large: boolean;
};

const Client = ({ element, content, large = false }: IClient) => {
  return (
    <Link href={element.data}>
      <span className={`${styles.client} ${large ? styles.large : ""}`}>
        <Image
          layout="fixed"
          height={large ? 32 : 24}
          width={large ? 32 : 24}
          alt={content}
          src={`/images/companies/${content
            .replace(" ", "")
            .replace("/", "")
            .toLowerCase()}.svg`}
          quality={100}
          objectFit="contain"
          priority={large}
        />
        <span>{content}</span>
      </span>
    </Link>
  );
}

export default Client;
