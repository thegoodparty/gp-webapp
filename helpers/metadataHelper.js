const pageMetaData = ({
  title,
  description,
  image = 'https://assets.goodparty.org/share.jpg',
  slug = '/',
}) => {
  return {
    title,
    description,
    alternates: {
      canonical: slug,
    },
    openGraph: {
      images: image,
      title,
      description,
    },
  };
};

export default pageMetaData;
