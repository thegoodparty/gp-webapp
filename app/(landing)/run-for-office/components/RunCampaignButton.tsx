import PrimaryButton from '@shared/buttons/PrimaryButton'
import WarningButton from '@shared/buttons/WarningButton'
import Link from 'next/link'

interface WrapperProps {
  children: React.ReactNode
  color: string
  fullWidth?: boolean
}

const Wrapper = ({ children, color, ...props }: WrapperProps): React.JSX.Element => {
  if (color === 'primary') {
    return <PrimaryButton {...props}>{children}</PrimaryButton>
  }
  return <WarningButton {...props}>{children}</WarningButton>
}

interface RunCampaignButtonProps {
  fullWidth?: boolean
  id?: string
  label?: string
  color?: string
}

export default function RunCampaignButton({
  fullWidth,
  id = '',
  label = 'Get Free Tools',
  color = 'primary',
}: RunCampaignButtonProps): React.JSX.Element {
  return (
    <Link href="/login" id={id}>
      <Wrapper fullWidth={fullWidth} color={color}>
        <div className=" tracking-wide">{label}</div>
      </Wrapper>
    </Link>
  )
}
