/// <reference types="next" />
/// <reference types="next/types/global" />

type IPost = {
  id: string;
  title: string;
  link: string;
  caption: string;
  description: string;
  image: string;
};

type PrismicDocument<T> = { data: T };

type PrismicSlice = {
  slice_type: string;
  primary: any;
  items: any[];
};

type PrismicImg = {
  url: string;
  dimensions: {
    width: number;
    height: number;
  };
  alt?: string;
};
