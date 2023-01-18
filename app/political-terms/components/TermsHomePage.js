import MaxWidth from '@shared/layouts/MaxWidth';
import { Fragment, Suspense } from 'react';
import AdminClientLoad from './AdminClientLoad';
import LayoutWithAlphabet from './LayoutWithAlphabet';
import TermSnippet from './TermSnippet';

export default function TermsHomePage(props) {
  const { items, activeLetter } = props;
  return (
    <MaxWidth>
      <div className="my-9 lg:my-16">
        <h1 className="font-black text-4xl lg:text-5xl mb-4">Terms Glossary</h1>
        <div className="text-lg">
          Good Party's Terms Glossary is a list of definitions of words from the
          political and elections world. These terms are from an independent's
          perspective with an eye toward reform. If you have a suggestion for a
          new definition, send it to{' '}
          <a href="mailto:ask@goodparty.org" rel="noopener noreferrer nofollow">
            ask@goodparty.org.
          </a>
        </div>
        <LayoutWithAlphabet {...props}>
          {items && items.length > 0 ? (
            <>
              {items.map((item) => (
                <Fragment key={item.title}>
                  <TermSnippet item={item} />
                </Fragment>
              ))}
            </>
          ) : (
            <div className="text-2xl font-black">
              No items available for the letter {activeLetter}
            </div>
          )}
        </LayoutWithAlphabet>
        <Suspense>
          <AdminClientLoad />
        </Suspense>
      </div>
    </MaxWidth>
  );
}
