import H4 from '@shared/typography/H4';
import Body2 from '@shared/typography/Body2';
import { StyledAlert } from '@shared/alerts/StyledAlert';
import Button from '@shared/buttons/Button';

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
      <div className={`p-2 mr-2 ${actionText ? 'lg:max-w-[73%]' : ''}`}>
        {title && <H4 className="mb-2">{title}</H4>}
        <Body2>{message}</Body2>
      </div>
      {actionText && (
        <Button
          href={actionHref ? actionHref : undefined}
          className="!text-base lg:self-center lg:mr-2"
          onClick={actionOnClick}
          color={severity}
        >
          {actionText}
        </Button>
      )}
    </div>
  </StyledAlert>
);
