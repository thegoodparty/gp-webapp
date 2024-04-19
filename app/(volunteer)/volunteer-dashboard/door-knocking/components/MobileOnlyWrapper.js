import DesktopQr from './DesktopQr';

export default function MobileOnlyWrapper({ children }) {
  return (
    <div>
      <DesktopQr />
      <div className="lg:hidden">{children}</div>
    </div>
  );
}
