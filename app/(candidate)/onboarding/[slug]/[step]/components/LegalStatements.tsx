import { faqArticleRoute } from 'helpers/articleHelper'

export const LegalStatements = (): React.JSX.Element => (
  <ul>
    <li>
      I will abide by a{' '}
      <a
        className="underline"
        href={`${faqArticleRoute('what-is-good-partys-minimum-standard-of-civility')}`}
        target="_blank"
      >
        minimum standard of civility
      </a>{' '}
      and acknowledge that GoodParty.org maintains the right to withdraw its
      GoodParty.org Certified endorsement and remove me from the site if I
      actively engage in such conduct.
    </li>
    <li>
      I agree to the GoodParty.org{' '}
      <a className="underline" href="/privacy" target="_blank">
        privacy policy
      </a>{' '}
    </li>
    <li>
      I acknowledge GoodParty.org maintains the right to remove users from the
      platform and withdraw its GoodParty.org certification and endorsement if
      users engage in conduct that violates these terms of service.
    </li>
    <li>
      <a
        className="underline cursor-pointer"
        href="/terms-of-service"
        target="_blank"
      >
        Terms of Service
      </a>
    </li>
  </ul>
)
