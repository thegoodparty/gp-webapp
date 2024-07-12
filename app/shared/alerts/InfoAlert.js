import { Alert } from '@mui/material';
import { MdInfo } from 'react-icons/md';

export const InfoAlert = ({ children, className = '', ...restProps }) => (
  <Alert
    className={`
      text-info-dark 
      border-info-dark 
      rounded-lg 
      bg-info-background
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
    severity="info"
    icon={<MdInfo className="text-info-dark h-6 w-6" />}
    {...restProps}
  >
    {children}
  </Alert>
);
