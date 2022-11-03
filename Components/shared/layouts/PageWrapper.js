import Footer from './Footer';

export default function PageWrapper({ children, hideFooter }) {
  return (
    <div>
      {children}
      {!hideFooter && <Footer />}
    </div>
  );
}
