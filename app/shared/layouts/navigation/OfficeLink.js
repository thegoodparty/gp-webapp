import {
  getServerCandidateCookie,
  getServerUser,
} from 'helpers/userServerHelper';
import Link from 'next/link';

export default function OfficeLink() {
  const user = getServerUser();
  const candidate = getServerCandidateCookie();
  return (
    <>
      {!candidate ? (
        <Link
          href="run-for-office"
          className="font-medium mr-6"
          id="desktop-header-run-for-office"
        >
          Run for Office
        </Link>
      ) : (
        <div>candidate</div>
      )}
    </>
  );
}
