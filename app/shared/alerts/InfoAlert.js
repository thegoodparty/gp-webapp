import { StyledAlert } from '@shared/alerts/StyledAlert';
import { MdInfo } from 'react-icons/md';

export const InfoAlert = ({ children, className = '', ...restProps }) => (
  <StyledAlert
    level="info"
    icon={<MdInfo />}
    className={className}
    {...restProps}
  >
    {children}
  </StyledAlert>
);
