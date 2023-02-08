import GpHead from '@shared/layouts/GpHead';
import { fetchArticle } from './page';

export default async function Head({ params }) {
  const { titleId } = params;
  const title = titleId?.length > 0 ? titleId[0] : false;
  const id = titleId?.length > 1 ? titleId[1] : false;

  const { content } = await fetchArticle(id);
  return (
    <GpHead
      title={`${content.title} | FAQs | GOOD PARTY`}
      description="Frequently Asked Questions about GOOD PARTY."
      slug="/faqs"
    />
  );
}
