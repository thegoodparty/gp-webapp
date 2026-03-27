import { GoodPartyOrgLogo } from '../components/ui/good-party-org-logo'
import { GoodPartyOrgLogoWordmark } from '../components/ui/good-party-org-logo-wordmark'

// Both SVGs share a 130px viewBox height, so applying the same CSS height to either
// renders the logo icon at identical physical size regardless of wordmark visibility.
// Widths are proportional: logo = height × (160/130), wordmark = height × (967/130)
const SIZE_MAP = {
  small:   { logoClass: '!w-[20px] !h-[16px]', wordmarkClass: '!w-[119px] !h-[16px]', label: 'Small (16px)' },
  default: { logoClass: '!w-[30px] !h-[24px]', wordmarkClass: '!w-[178px] !h-[24px]', label: 'Default (24px)' },
  medium:  { logoClass: '!w-[39px] !h-[32px]', wordmarkClass: '!w-[238px] !h-[32px]', label: 'Medium (32px)' },
  large:   { logoClass: '!w-[49px] !h-[40px]', wordmarkClass: '!w-[297px] !h-[40px]', label: 'Large (40px)' },
  xl:      { logoClass: '!w-[59px] !h-[48px]', wordmarkClass: '!w-[357px] !h-[48px]', label: 'Extra Large (48px)' },
  xxl:     { logoClass: '!w-[79px] !h-[64px]', wordmarkClass: '!w-[476px] !h-[64px]', label: 'XXL (64px)' },
}

const meta = {
  title: 'Foundations/Logo',
  parameters: {
    layout: 'fullscreen',
    backgrounds: { disable: true },
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['small', 'default', 'medium', 'large', 'xl', 'xxl'],
      description: 'Height of the logo',
      table: { defaultValue: { summary: 'default' } },
    },
    wordmark: {
      control: 'boolean',
      description: 'Show the GoodParty.org wordmark',
      table: { defaultValue: { summary: false } },
    },
    mode: {
      control: 'radio',
      options: ['light', 'dark'],
      description: 'Background mode (affects wordmark text color)',
      table: { defaultValue: { summary: 'light' } },
    },
  },
  args: {
    size: 'default',
    wordmark: false,
    mode: 'light',
  },
}

export default meta

export const Logo = {
  render: ({ size, wordmark, mode }) => {
    const isDark = mode === 'dark'
    const bg = isDark ? '#0a0a0a' : '#ffffff'
    const { logoClass, wordmarkClass } = SIZE_MAP[size]

    return (
      <div
        style={{
          backgroundColor: bg,
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {wordmark ? (
          <GoodPartyOrgLogoWordmark
            className={wordmarkClass}
            textVariant={isDark ? 'light' : 'dark'}
          />
        ) : (
          <GoodPartyOrgLogo className={logoClass} />
        )}
      </div>
    )
  },
}
