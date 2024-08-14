import { Alert } from '@mui/material';
import { AlertIcon } from '@shared/alerts/AlertIcon';

export const StyledAlert = ({
  children,
  severity,
  className = '',
  ...restProps
}) => {
  let textClass = 'text-info-dark';
  let borderClass = 'border-info-dark';
  if (severity === 'error') {
    textClass = 'text-error-dark';
    borderClass = 'border-error-dark';
  } else if (severity === 'success') {
    textClass = 'text-success-dark';
    borderClass = 'border-success-dark';
  } else if (severity === 'warning') {
    textClass = 'text-warning-dark';
    borderClass = 'border-warning-dark';
  }

  return (
    <Alert
      className={`
      ${textClass}
      ${borderClass}
      rounded-lg 
      bg-${severity}-background
      p-2
      [&>div.MuiAlert-message]:p-0
      [&>div.MuiAlert-icon]:py-2
      [&>div.MuiAlert-icon]:ml-2
      [&>div.MuiAlert-icon]:mr-4
      [&>div.MuiAlert-icon]:block
      [&>div.MuiAlert-icon]:h-fit
      [&>div.MuiAlert-message]:flex-grow
      ${className}
    `}
      severity={severity}
      icon={
        <AlertIcon
          severity={severity}
          className={`text-${severity}-dark h-6 w-6`}
        />
      }
      {...restProps}
    >
      {children}
    </Alert>
  );
};
