import slugify from 'slugify';

const slug = (str: string) => (
  slugify(str, { lower: true, strict: true })
);

export default slug;