import clsx from 'clsx';

export default function BlogH2({ children, className }) {
  return (
    <h2 className={clsx('font-medium text-2xl leading-snug mb-6', className)}>
      {children}
    </h2>
  );
}
