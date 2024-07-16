import { MdError, MdInfo } from 'react-icons/md';

export const AlertIcon = ({ level, className }) => {
  switch (level) {
    case 'error':
      return <MdError className={className} />;
    case 'info':
      return <MdInfo className={className} />;
    default:
      return null;
  }
};
