import MaxWidth from '@shared/layouts/MaxWidth';

export default function OnboardingWrapper({ children, title }) {
  return (
    <div className="bg-zinc-100">
      <MaxWidth>
        <div style={{ minHeight: 'calc(100vh - 80px)' }} className="py-14">
          <div>
            {title && <h1 className="text-2xl mb-8 font-black">{title}</h1>}
            <div>{children}</div>
          </div>
        </div>
      </MaxWidth>
    </div>
  );
}
