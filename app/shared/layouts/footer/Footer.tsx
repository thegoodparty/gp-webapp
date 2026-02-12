'use client'
import Link from 'next/link'
import Image from 'next/image'
import { FOOTER_COLUMNS, SOCIAL_LINKS } from 'app/shared/layouts/constants'
import MaxWidth from 'app/shared/layouts/MaxWidth'
import { FooterButtonLink } from '@shared/layouts/footer/components/FooterButtonLink'
import { FooterExternalLink } from '@shared/layouts/footer/components/FooterExternalLink'
import { FooterLinkWrapper } from '@shared/layouts/footer/components/FooterLinkWrapper'
import { isProductRoute } from '@shared/utils/isProductRoute'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

const year = new Date().getFullYear()

interface FooterProps {
  initPathname: string
}

export const Footer = ({
  initPathname,
}: FooterProps): React.JSX.Element | null => {
  const pathname = usePathname()
  const [show, setShow] = useState(!isProductRoute(initPathname))

  useEffect(() => {
    setShow(!isProductRoute(pathname))
  }, [pathname])

  if (!show) {
    return null
  }

  return (
    <footer className="bg-primary-dark px-8 py-6 border-solid border-t border-zinc-200 pt-10">
      <MaxWidth>
        <div className="grid grid-cols-12">
          {FOOTER_COLUMNS.map((column) => (
            <div
              key={column.title}
              data-cy="footer-column"
              className="col-span-12 md:col-span-4 lg:col-span-3 text-start lg:text-left pt-10 md:pt-0"
            >
              <div
                className="text-slate-50 font-medium text-xl mb-5"
                data-cy="footer-column-title"
              >
                {column.title}
              </div>
              {column.links.map((link, linkKey) => (
                <FooterLinkWrapper key={linkKey}>
                  {link.isExternal ? (
                    <FooterExternalLink {...link} />
                  ) : link.buttonStyle ? (
                    <FooterButtonLink
                      {...link}
                      buttonStyle={link.buttonStyle as 'tertiary' | 'secondary'}
                    />
                  ) : link.useNativeLink ? (
                    <a
                      id={link.id}
                      href={link.link}
                      className="ml-3"
                      data-cy="footer-link"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      id={link.id}
                      className="ml-3"
                      href={link.link}
                      data-cy="footer-link"
                    >
                      {link.label}
                    </Link>
                  )}
                </FooterLinkWrapper>
              ))}
            </div>
          ))}
          <div className="col-span-12 lg:col-span-3 text-start pt-10 md:pt-0">
            <Image
              src="/images/logo/logo-white.svg"
              data-cy="logo"
              width={222}
              height={52}
              alt="GoodParty.org"
            />
            <div
              className="font-sfpro font-normal text-slate-200 text-[16px] leading-[24px] mt-4 max-w-lg"
              data-cy="footer-join-us"
            >
              Not a political party. We&apos;re building free tools to change
              the rules, so good independent candidates can run and win!
              <br />
              <br />
              <Link
                id="footer-join-us"
                href="/login"
                data-cy="footer-join-us-link"
              >
                Join us!
              </Link>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-12 mt-12">
          <div className="col-span-12 md:col-span-9">
            <div
              className="font-sfpro text-start lg:text-left text-slate-200"
              data-cy="footer-copyright"
            >
              Copyright &copy; {year} GoodParty.org. All rights reserved. &nbsp;
              <Link
                href="/privacy"
                data-cy="footer-privacy-link"
                className="font-normal text-slate-200"
              >
                Privacy Policy.
              </Link>{' '}
              &nbsp;
              <Link
                href="/terms-of-service"
                data-cy="footer-terms-of-service-link"
                className="font-normal text-slate-200"
              >
                Terms of Service.
              </Link>
            </div>
          </div>
          <div className="flex col-span-12 md:col-span-3 justify-start order-first md:order-last mb-10">
            {SOCIAL_LINKS.map((social) => (
              <div
                key={social.label}
                data-cy="footer-social"
                className="justify-start text-slate-50 text-[20px] pr-5"
              >
                <a
                  href={social.link}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  title={social.label}
                  data-cy="footer-link"
                  className="inline-block"
                >
                  {social.icon}
                </a>
              </div>
            ))}
          </div>
        </div>
      </MaxWidth>
    </footer>
  )
}

export default Footer
