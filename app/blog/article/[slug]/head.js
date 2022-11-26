import GpHead from '@shared/layouts/GpHead';
import { fetchArticle } from './page';

export default async function Head({ params }) {
  const { slug } = params;
  const { content } = await fetchArticle(slug);
  return (
    <GpHead
      title={`${content.title} | Good Party`}
      description={content.summary}
      image={content.mainImage && `https:${content.mainImage.url}`}
    />
  );
}
