import { notFound, redirect } from 'next/navigation';

export default async function Page({ params }) {
  const { oldSlug } = params;
  const name = oldSlug?.length > 0 ? oldSlug[0] : false;
  const id = oldSlug?.length > 1 ? oldSlug[1] : false;

  if (!id) {
    notFound();
  }
  redirect(`/candidate/${name.toLowerCase()}`);

  return <></>;
}
