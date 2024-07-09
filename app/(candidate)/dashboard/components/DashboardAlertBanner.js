import H4 from '@shared/typography/H4';
import Body2 from '@shared/typography/Body2';
import Link from 'next/link';
import InfoButton from '@shared/buttons/InfoButton';
import { MdChevronRight } from 'react-icons/md';
import { InfoAlert } from '@shared/alerts/InfoAlert';

export const DashboardAlertBanner = ({
  title,
  message,
  actionHref,
  actionText,
}) => (
  <InfoAlert className="mb-4" variant="outlined" severity="info">
    <div className="flex flex-col flex-grow lg:justify-between lg:flex-row">
      <div className="p-2 mr-2 lg:max-w-[73%]">
        <H4 className="mb-2">{title}</H4>
        <Body2 className="mb-4">{message}</Body2>
      </div>
      {actionHref && actionText && (
        <Link
          className="
          inline-block
          hover:no-underline
        "
          href={actionHref}
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
            {actionText}
            <MdChevronRight className="ml-2 h-6 w-6" />
          </InfoButton>
        </Link>
      )}
    </div>
  </InfoAlert>
);
