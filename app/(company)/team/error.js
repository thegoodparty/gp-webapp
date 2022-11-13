'use client';

// 'use client' marks this page as a Client Component
// https://beta.nextjs.org/docs/rendering/server-and-client-components

import ErrorAnimation from '../../shared/layouts/ErrorAnimation';

export default function Error() {
  //   useEffect(() => {
  //     // Log the error to an error reporting service
  //     console.error(error);
  //   }, [error]);

  return <ErrorAnimation />;
}
