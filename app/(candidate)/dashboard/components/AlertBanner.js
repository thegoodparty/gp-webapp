import H4 from '@shared/typography/H4';
import Body2 from '@shared/typography/Body2';
import Link from 'next/link';
import { StyledAlert } from '@shared/alerts/StyledAlert';
import { SeverityButton } from '@shared/buttons/SeverityButton';

export const AlertBanner = ({
  title,
  message,
  actionHref,
  actionText,
  severity = 'info',
  actionOnClick,
  ...restProps
}) => (
  <StyledAlert
    className="mb-4"
    variant="outlined"
    severity={severity}
    {...restProps}
  >
    <div className="flex flex-col flex-grow lg:justify-between lg:flex-row">
      <div className="p-2 mr-2 lg:max-w-[73%]">
        {title && <H4 className="mb-2">{title}</H4>}
        <Body2>{message}</Body2>
      </div>
      {actionHref ? (
        <Link
          className="
            inline-block
            hover:no-underline
          "
          href={actionHref}
        >
          {actionText && (
            <SeverityButton onClick={actionOnClick} severity={severity}>
              {actionText}
            </SeverityButton>
          )}
        </Link>
      ) : (
        actionText && (
          <SeverityButton
            className="h-fit"
            onClick={actionOnClick}
            severity={severity}
          >
            {actionText}
          </SeverityButton>
        )
      )}
    </div>
  </StyledAlert>
);
