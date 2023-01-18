import MaxWidth from '@shared/layouts/MaxWidth';
import Link from 'next/link';

const links = [
  { href: '/onboarding', label: 'Candidate Details' },
  { href: '/onboarding/goals', label: 'Goals & Objectives' },
  { href: '/onboarding/goals', label: 'Campaign Message & Strategy' },
  { href: '/onboarding/goals', label: 'Build a Campaign Team' },
  { href: '/onboarding/goals', label: 'Budget & Fundraising Plan' },
  { href: '/onboarding/goals', label: 'Voter Outreach & Engagement' },
];

export default function OnboardingWrapper({
  children,
  title,
  description,
  self,
}) {
  return (
    <div className="bg-white lg:bg-zinc-100">
      <MaxWidth>
        <div style={{ minHeight: 'calc(100vh - 80px)' }} className="py-14">
          <div>
            {title && <h1 className="text-3xl mb-3 font-black">{title}</h1>}
            {description && (
              <h2 className="text-sm mb-10 text-zinc-500 border-b-2 border-gray-200 pb-10">
                {description}
              </h2>
            )}
            <div className="grid grid-cols-12 gap-4">
              <div className="hidden lg:block lg:col-span-3 p-3">
                {links.map((link) => (
                  <div className="mb-6" key={link.href}>
                    {self === '/onboarding' ? (
                      <div
                        className={`${
                          link.href === self ? 'font-bold' : 'text-stone-400'
                        }`}
                      >
                        {link.label}
                      </div>
                    ) : (
                      <Link
                        href={link.href}
                        className={`${link.href === self && 'font-bold'}`}
                      >
                        {link.label}
                      </Link>
                    )}
                  </div>
                ))}
              </div>
              <div className="col-span-12 lg:col-span-9 ">{children}</div>
            </div>
          </div>
        </div>
      </MaxWidth>
    </div>
  );
}
