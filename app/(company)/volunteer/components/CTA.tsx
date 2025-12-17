import Button from '@shared/buttons/Button'

interface CTAProps {
  id?: string
}

export default function CTA({ id }: CTAProps): React.JSX.Element {
  return (
    <Button
      href="https://goodpartyorg.circle.so/join?invitation_token=972b834345e05305e97fcc639c51ac54e3a04d8b-1c106100-4719-4b8a-81e1-73e513bbcd5f"
      id={id}
      size="large"
      color="secondary"
    >
      Get Involved
    </Button>
  )
}
