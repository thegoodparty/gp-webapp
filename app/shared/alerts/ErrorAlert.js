import { StyledAlert } from '@shared/alerts/StyledAlert';
import { MdError } from 'react-icons/md';

export const ErrorAlert = ({ children, className = '', ...restProps }) => (
  <StyledAlert
    level="error"
    icon={<MdError />}
    className={className}
    {...restProps}
  >
    {children}
  </StyledAlert>
);
