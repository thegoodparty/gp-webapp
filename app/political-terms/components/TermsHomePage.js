import MaxWidth from '@shared/layouts/MaxWidth';
import LayoutWithAlphabet from './LayoutWithAlphabet';
import TermSnippet from './TermSnippet';

const item = {
  title: 'Term title',
  description:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
};

export default function TermsHomePage(props) {
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
          <TermSnippet item={item} />
          <TermSnippet item={item} />
          <TermSnippet item={item} />
          <TermSnippet item={item} last />
        </LayoutWithAlphabet>
      </div>
    </MaxWidth>
  );
}
