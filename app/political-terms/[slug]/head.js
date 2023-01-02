import GpHead from '@shared/layouts/GpHead';
import { fetchGlossaryByTitle } from './page';

export default async function Head({ params }) {
  const { slug } = params;
  if (slug.length === 1) {
    return (
      <GpHead
        title={`Political Terms Starting With ${slug} | Good Party`}
        description="Political terms and definitions, elevate your political game with our easy to use political database at Good Party"
        slug={`/political-terms/${slug}`}
      />
    );
  }
  const { content } = await fetchGlossaryByTitle(slug);
  const title = content?.title;
  return (
    <GpHead
      title={`${title} Meaning & Definition | Good Party`}
      description={`${title} meaning and definition. Find 100's of terms related to the US political system at Good Party!`}
      slug={`/political-terms/${slug}`}
    />
  );
}
