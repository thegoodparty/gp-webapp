import PrimaryButton from '@shared/buttons/PrimaryButton'
import WarningButton from '@shared/buttons/WarningButton'
import Link from 'next/link'

const Wrapper = ({ children, color, ...props }) => {
  if (color === 'primary') {
    return <PrimaryButton {...props}>{children}</PrimaryButton>
  }
  return <WarningButton {...props}>{children}</WarningButton>
}

export default function RunCampaignButton({
  fullWidth,
  id = '',
  label = 'Get Free Tools',
  color = 'primary',
}) {
  return (
    <Link href="/login" id={id}>
      <Wrapper fullWidth={fullWidth} color={color}>
        <div className=" tracking-wide">{label}</div>
      </Wrapper>
    </Link>
  )
}
