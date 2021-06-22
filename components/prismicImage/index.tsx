import NextImage from 'next/image';
import type { ImageProps } from 'next/image';

type IPrismicImage = Omit<ImageProps, 'src' | 'placeholder' | 'layout' | 'blurDataURL'> & {
  src: PrismicImage;
  layout?: 'responsive' | 'fixed';
};

const PrismicImage = ({
  src,
  width,
  height,
  alt,
  layout = 'responsive',
  ...props
}: IPrismicImage) => (
  <NextImage
    src={src.url}
    width={width || src.dimensions?.width}
    height={height || src.dimensions?.height}
    alt={alt || src.alt}
    layout={layout}
    unoptimized={process.env.NODE_ENV === 'development'}
    quality={100}
    {...props}
  />
);

export default PrismicImage;
