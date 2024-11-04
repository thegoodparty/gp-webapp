import MaxWidth from '@shared/layouts/MaxWidth';
import { Fragment, Suspense } from 'react';
import AdminClientLoad from './AdminClientLoad';
import LayoutWithAlphabet from './LayoutWithAlphabet';
import TermSnippet, { termLinkByTitle } from './TermSnippet';
import Link from 'next/link';
import TermsSearch from './TermsSearch';
// import { useTheme, useMediaQuery } from '@mui/material';

export default function TermsHomePage(props) {
  const { items, activeLetter, glossaryItems, recentGlossaryItems } = props;
  // const theme = useTheme();
  // const desktopMode = useMediaQuery(theme.breakpoints.up('md'));

  return (
    <MaxWidth>
      <div className="my-9 lg:my-16">
        <div className="grid grid-cols-12 gap-3">
          <div className="col-span-12 lg:col-span-9">
            <h1 className="font-black text-4xl lg:text-5xl mb-4">
              Terms Glossary
            </h1>
            <div className="text-lg">
              GoodParty.org&apos;s Terms Glossary is a list of definitions of
              words from the political and elections world. These terms are from
              an independent&apos;s perspective with an eye toward reform. If
              you have a suggestion for a new definition, send it to{' '}
              <a
                href="mailto:ask@goodparty.org"
                rel="noopener noreferrer nofollow"
              >
                ask@goodparty.org.
              </a>
            </div>
          </div>
          <div className="col-span-12 lg:col-span-3">
            <TermsSearch glossaryItems={glossaryItems} />
          </div>
        </div>

        {recentGlossaryItems && recentGlossaryItems.length > 0 ? (
          <>
            <div className="text-lg lg:flex pt-4">
              <h2 className="mb-1 lg:mb-0 lg:basis-1/3">
                <strong>RECENTLY ADDED TERMS</strong>
              </h2>
            </div>

            {recentGlossaryItems.map((item) => (
              <Fragment key={item}>
                <Link href={termLinkByTitle(item)} className="block">
                  <div className="text-lg lg:flex  pt-2 mt-2">
                    <h2 className="mb-1 lg:mb-0 lg:basis-1/3 underline">
                      {item}
                    </h2>
                  </div>
                </Link>
              </Fragment>
            ))}
          </>
        ) : (
          <></>
        )}

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
