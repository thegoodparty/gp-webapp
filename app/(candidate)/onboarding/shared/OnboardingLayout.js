import CardPageWrapper from '@shared/cards/CardPageWrapper'

export default function OnboardingLayout(props) {
  const { children, step } = props
  return <CardPageWrapper>{children}</CardPageWrapper>
}
