import BlackButton from '@shared/buttons/BlackButton';
import MaxWidth from '@shared/layouts/MaxWidth';
import Link from 'next/link';

export default function TermsItemPage({ item }) {
  const { title, description, cta, link } = item;
  const isAbsolute = link && link.startsWith('http');
  return (
    <MaxWidth>
      <div className="my-9 lg:my-16">
        <h1 className="font-black text-4xl lg:text-5xl mb-4">{title}</h1>
        <div className="text-lg mb-6">{description}</div>
        {isAbsolute ? (
          <a href={link} rel="noopener noreferrer nofollow" target="_blank">
            <BlackButton>{cta}</BlackButton>
          </a>
        ) : (
          <Link href={link}>
            <BlackButton>{cta}</BlackButton>
          </Link>
        )}
      </div>
    </MaxWidth>
  );
}
