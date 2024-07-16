import { Alert } from '@mui/material';
import { AlertIcon } from '@shared/alerts/AlertIcon';

export const StyledAlert = ({
  children,
  level,
  className = '',
  ...restProps
}) => (
  <Alert
    className={`
      text-${level}-dark 
      border-${level}-dark 
      rounded-lg 
      bg-${level}-background
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
    severity={level}
    icon={<AlertIcon level={level} className={`text-${level}-dark h-6 w-6`} />}
    {...restProps}
  >
    {children}
  </Alert>
);
