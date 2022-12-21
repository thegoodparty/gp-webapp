import MaxWidth from '@shared/layouts/MaxWidth';
import { Fragment } from 'react';
import LayoutWithAlphabet from './LayoutWithAlphabet';
import TermSnippet from './TermSnippet';

export default function TermsHomePage(props) {
  const { items, activeLetter } = props;
  return (
    <MaxWidth>
      <div className="my-9 lg:my-16">
        <h1 className="font-black text-4xl lg:text-5xl mb-4">Terms Glossary</h1>
        <div className="text-lg">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat.
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
      </div>
    </MaxWidth>
  );
}
