import H4 from '@shared/typography/H4';
import Body2 from '@shared/typography/Body2';
import Link from 'next/link';
import InfoButton from '@shared/buttons/InfoButton';
import { MdChevronRight } from 'react-icons/md';
import { InfoAlert } from '@shared/alerts/InfoAlert';

export const ProSignUpAlert = () => (
  <InfoAlert className="mb-4" variant="outlined" severity="info">
    <div className="flex flex-col lg:justify-between lg:flex-row">
      <div className="p-2 mr-2 lg:max-w-[73%]">
        <H4 className="mb-2">Ready to take the leap and upgrade to pro?</H4>
        <Body2 className="mb-4">
          For just $10 a month, you&quot;ll gain access to essential tools such
          as voter data, campaign management resources, and expert guidance to
          navigate the complexities of running for office.
        </Body2>
      </div>
      <Link
        className="
          inline-block
          hover:no-underline
        "
        href="/dashboard/pro-sign-up"
      >
        <InfoButton
          className="
            flex
            items-center
            text-info-contrast
            bg-info
            hover:bg-info-dark
            w-full
            justify-center
            lg:justify-normal
            lg:w-auto
          "
          size="medium"
        >
          Upgrade Today
          <MdChevronRight className="ml-2 h-6 w-6" />
        </InfoButton>
      </Link>
    </div>
  </InfoAlert>
);
