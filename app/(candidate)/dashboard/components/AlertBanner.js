import H4 from '@shared/typography/H4';
import Body2 from '@shared/typography/Body2';
import Link from 'next/link';
import InfoButton from '@shared/buttons/InfoButton';
import { StyledAlert } from '@shared/alerts/StyledAlert';
import ErrorButton from '@shared/buttons/ErrorButton';
import SuccessButton from '@shared/buttons/SuccessButton';
import PrimaryButton from '@shared/buttons/PrimaryButton';
import WarningButtonNew from '@shared/buttons/WarningButtonNew';

const SeverityButton = ({
  children,
  className = '',
  severity = 'info',
  ...restProps
}) => {
  let ButtonComponent = <></>;
  switch (severity) {
    case 'info':
      ButtonComponent = InfoButton;
      break;
    case 'warning':
      ButtonComponent = WarningButtonNew;
      break;
    case 'error':
      ButtonComponent = ErrorButton;
      break;
    case 'success':
      ButtonComponent = SuccessButton;
      break;
    default:
      ButtonComponent = PrimaryButton;
  }
  return (
    <ButtonComponent
      className={`
      flex
      items-center
      text-info-contrast
      bg-info-dark
      hover:bg-info
      w-full
      justify-center
      lg:justify-normal
      lg:w-auto
      ${className}
    `}
      size="medium"
      {...restProps}
    >
      {children}
    </ButtonComponent>
  );
};

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
        <H4 className="mb-2">{title}</H4>
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
