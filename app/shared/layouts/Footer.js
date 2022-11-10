import Link from 'next/link';
import Image from 'next/image';
import { FOOTER_COLUMNS } from './constants';
import MaxWidth from './MaxWidth';

const year = new Date().getFullYear();

export default function Footer() {
  return (
    <footer className="px-8 py-6 border-solid border-t border-zinc-200 lg:py-10">
      <MaxWidth>
        <div className="grid grid-cols-1 lg:grid-cols-6">
          {FOOTER_COLUMNS.map((column) => (
            <div
              key={column.title}
              data-cy="footer-column"
              className="text-center lg:text-left"
            >
              <div
                className="text-zinc-500 font-black mb-5"
                data-cy="footer-column-title"
              >
                {column.title}
              </div>
              {column.links.map((link) => (
                <div
                  key={link.label}
                  data-cy="footer-link-wrapper"
                  className="font-semibold mb-5"
                >
                  {link.isExternal ? (
                    <a
                      href={link.link}
                      target="_blank"
                      rel="noopener noreferrer nofollow"
                      title={link.label}
                      data-cy="footer-link"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link href={link.link} data-cy="footer-link">
                      {link.label}
                    </Link>
                  )}
                </div>
              ))}
            </div>
          ))}
          <div className="lg:col-span-2 text-center">
            <Image
              src="/images/black-logo.svg"
              data-cy="logo"
              width={174}
              height={20}
              alt="GOOD PARTY"
              className="mx-auto"
            />
            <div className="italic mt-4" data-cy="footer-join-us">
              Not a political party. We&apos;re building free tools to change
              the rules, so good independent candidates can run and win!{' '}
              <Link href="/register" data-cy="footer-join-us-link">
                Join us!
              </Link>
            </div>
          </div>
        </div>
        <div
          className="text-center lg:text-left mt-12 text-neutral-500 lg:mt-32"
          data-cy="footer-copyright"
        >
          &copy; {year} Good Party. All rights reserved. &nbsp;
          <Link
            href="/privacy"
            data-cy="footer-privacy-link"
            className="font-semibold text-black"
          >
            Privacy Policy
          </Link>
        </div>
      </MaxWidth>
    </footer>
  );
}
