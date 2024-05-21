import Link from 'next/link';

export const leftMenuItems = [
  {
    label: 'Admin Dashboard',
    link: '/admin',
  },
  {
    label: 'Candidates',
    link: '/admin/candidates',
  },
  {
    label: 'Campaign Statistics',
    link: '/admin/campaign-statistics',
  },
  {
    label: 'Users',
    link: '/admin/users',
  },
  {
    label: 'Top Issues',
    link: '/admin/top-issues',
  },
  {
    label: 'Bust Cache',
    link: '/admin/caches',
  },
  {
    label: 'AI Content',
    link: '/admin/ai-content',
  },
  {
    label: 'Misc Actions',
    link: '/admin/misc-actions',
  },
  {
    label: 'P2V Stats',
    link: '/admin/p2v-stats',
  },
];

export default function AdminLeftMenu({ pathname }) {
  return (
    <div className="px-3 pt-5 text-center lg:w-60 lg:min-w-[240px] lg:pt-14 lg:pr-3 lg:pb-0 lg:pl-3 lg:text-left">
      {leftMenuItems.map((item) => (
        <Link href={item.link} data-cy="portal-left-menu-item" key={item.label}>
          <div
            className="inline-block text-zinc-600 pr-5 pb-4 lg:block lg:pb-10 lg:pr-0"
            style={
              pathname === item.link
                ? { fontWeight: '900', color: 'black' }
                : {}
            }
          >
            {item.label}
          </div>
        </Link>
      ))}
    </div>
  );
}
