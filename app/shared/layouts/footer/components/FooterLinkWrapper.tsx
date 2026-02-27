interface FooterLinkWrapperProps {
  children: React.ReactNode
}

export const FooterLinkWrapper = ({
  children,
}: FooterLinkWrapperProps): React.JSX.Element => (
  <div
    data-cy="footer-link-wrapper"
    className="font-[15px] text-slate-50 text-md mb-5"
  >
    {children}
  </div>
)
