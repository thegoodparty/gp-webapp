import { Open_Sans } from 'next/font/google'

const openSansBriefings = Open_Sans({
  subsets: ['latin'],
  variable: '--font-briefings',
})

const BriefingsSegmentLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <div
    className={openSansBriefings.variable}
    style={{ fontFamily: 'var(--font-briefings)' }}
  >
    {children}
  </div>
)

export default BriefingsSegmentLayout
