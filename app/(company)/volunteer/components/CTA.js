import Button from '@shared/buttons/Button'

export default function CTA({ id }) {
  return (
    <Button href="/info-session" id={id} size="large" color="secondary">
      Get Involved
    </Button>
  )
}
