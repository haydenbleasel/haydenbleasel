import type { FC } from 'react';
import Image from 'next/image';
import Link from '../link';

const Client: FC<{
  name: string;
  url: string;
  logo: any;
}> = (({ name, url, logo }) => (
  <Link href={url} key={name} label={name}>
    <Image
      layout="fixed"
      height={21}
      width={21}
      alt={name}
      src={logo}
      quality={100}
      objectFit="contain"
      priority
    />
  </Link>
));

export default Client;
