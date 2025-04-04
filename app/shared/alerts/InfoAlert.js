import { StyledAlert } from '@shared/alerts/StyledAlert'

export const InfoAlert = ({ children, className = '', ...restProps }) => (
  <StyledAlert severity="info" className={className} {...restProps}>
    {children}
  </StyledAlert>
)
