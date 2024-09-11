import clsx from 'clsx';

export default function HighlightedContent({ children, className }) {
  return (
    <div
      className={clsx(
        'my-8 py-6 px-8 bg-purple-50 border-l-[5px] border-purple rounded-md font-normal font-sfpro leading-6',
        className,
      )}
    >
      {children}
    </div>
  );
}
