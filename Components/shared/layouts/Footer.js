export default function PageWrapper({ children, hideFooter }) {
  <div>
    {children}
    {!hideFooter && <Footer></Footer>}
  </div>;
}
