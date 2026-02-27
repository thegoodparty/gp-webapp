import CardPageWrapper from '@shared/cards/CardPageWrapper'

interface OnboardingLayoutProps {
  children: React.ReactNode
}

export default function OnboardingLayout(
  props: OnboardingLayoutProps,
): React.JSX.Element {
  const { children } = props
  return <CardPageWrapper>{children}</CardPageWrapper>
}
