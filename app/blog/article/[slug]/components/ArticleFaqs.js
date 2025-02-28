import Body1 from '@shared/typography/Body1';
import MarketingH4 from '@shared/typography/MarketingH4';
import { faqArticleRoute } from 'helpers/articleHelper';
import Link from 'next/link';
import IconButton from '@shared/buttons/IconButton';
import { MdChevronRight } from 'react-icons/md';
import { apiRoutes } from 'gpApi/routes';
import { serverFetch } from 'gpApi/serverFetch';
import { fetchContentByType } from 'helpers/fetchHelper';

async function fetchFaqs() {
  const payload = {
    type: 'blogHome',
  };

  const resp = await fetchContentByType('blogHome');

  return resp.data;
}

export default async function ArticleFaqs() {
  const { faqs } = await fetchFaqs();

  if (!faqs || faqs.length <= 0) return null;

  return (
    <>
      <MarketingH4>Frequently Asked Questions</MarketingH4>
      <Body1 className="font-sfpro mt-2">
        Find answers to common questions about&nbsp;
        <Link href="/" className="text-blue">
          GoodParty.org
        </Link>
      </Body1>

      <ul className="list-none list-outside p-0 mb-8" data-testid="faqSection">
        {faqs.map((article) => (
          <li key={article.id}>
            <Link
              href={faqArticleRoute(article)}
              className="group font-sfpro flex items-center justify-between border-b-[1px] border-gray-200 py-2"
            >
              {article.title}
              <IconButton
                size="large"
                className="group-hover:bg-indigo-700/[0.08]"
              >
                <MdChevronRight />
              </IconButton>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
