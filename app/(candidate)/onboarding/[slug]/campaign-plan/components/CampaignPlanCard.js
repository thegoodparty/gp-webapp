import ArticleSnippet from 'app/blog/shared/ArticleSnippet';
import Link from 'next/link';

export default function CampaignPlanCard({ field, articlesBySlug, campaign }) {
  const { title, description, type, href, slug, isOnboardingLink, file } =
    field;

  if (type === 'inProgress') {
    return <div className="col-span-12 text-center">In progress</div>;
  }

  if (type === 'blog') {
    const content = articlesBySlug[slug];
    if (!content) {
      return null;
    }

    return (
      <div key={title} className="col-span-12 md:col-span-6 lg:col-span-4 ">
        <ArticleSnippet article={content} target="_blank" minimal />
      </div>
    );
  }

  if (type === 'file') {
    return (
      <article
        key={title}
        className="col-span-12 md:col-span-6 lg:col-span-4  bg-slate-50 rounded-lg p-6 flex justify-between flex-col"
      >
        <div>
          <h3 className="font-black text-2xl">{title}</h3>
          <div className="text-sm mt-4 mb-9">{description}</div>
        </div>
        <a href={file} className="text-violet-600 font-bold" download>
          Download File
        </a>
      </article>
    );
  }
  return (
    <article
      key={title}
      className="col-span-12 md:col-span-6 lg:col-span-4  bg-slate-50 rounded-lg p-6 flex justify-between flex-col"
    >
      <div>
        <h3 className="font-black text-2xl">{title}</h3>
        <div className="text-sm mt-4 mb-9">{description}</div>
      </div>
      {type === 'link' && (
        <Link
          href={`${
            isOnboardingLink ? `/onboarding/${campaign?.slug}` : ''
          }${href}`}
          className="text-violet-600 font-bold"
        >
          Read More
        </Link>
      )}
    </article>
  );
}
