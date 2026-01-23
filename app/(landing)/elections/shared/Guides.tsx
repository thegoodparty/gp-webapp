import PrimaryButton from '@shared/buttons/PrimaryButton'
import MaxWidth from '@shared/layouts/MaxWidth'
import ArticleSnippet from 'app/blog/shared/ArticleSnippet'
import Link from 'next/link'
import { Article } from './types'

interface GuidesProps {
  articles?: Article[]
}

export default function Guides({ articles }: GuidesProps): React.JSX.Element {
  return (
    <section className="mt-10 md:mt-20">
      <MaxWidth>
        <h2 className="text-center font-semibold text-4xl">
          Campaign guides and resources
        </h2>
        <div className="grid grid-cols-12 gap-6 mt-8">
          {articles && articles.map((article, index) => (
            <div key={article.id || index} className=" col-span-12 md:col-span-4">
              <ArticleSnippet article={article} heroMode={false} section={{}} />
            </div>
          ))}
        </div>
        <Link
          href="/blog/section/for-candidates"
          className="block mt-10 text-center"
          id="explore-more-resources"
        >
          <PrimaryButton>Explore more resources</PrimaryButton>
        </Link>
      </MaxWidth>
    </section>
  )
}

