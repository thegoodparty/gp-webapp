'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function FaqLink({ children, articleId }) {
  const pathname = usePathname();
  return <Link href={`${pathname}?article=${articleId}`}>{children}</Link>;
}
