import H4 from '@shared/typography/H4'
import Body2 from '@shared/typography/Body2'
import { StyledAlert } from '@shared/alerts/StyledAlert'
import { Button } from '@styleguide'
import Link from 'next/link'

type AlertSeverity = 'error' | 'info' | 'warning' | 'success'

const SEVERITY_VARIANT = {
  info: 'default',
  success: 'default',
  warning: 'destructive',
  error: 'destructive',
} as const

interface AlertBannerProps {
  title?: string
  message: string
  actionHref?: string
  actionText?: string
  severity?: AlertSeverity
  actionOnClick?: () => void
  [key: string]: string | boolean | number | (() => void) | undefined
}

export const AlertBanner = ({
  title,
  message,
  actionHref,
  actionText,
  severity = 'info',
  actionOnClick,
  ...restProps
}: AlertBannerProps): React.JSX.Element => (
  <StyledAlert
    className="mb-4"
    variant="outlined"
    severity={severity}
    {...restProps}
  >
    <div className="flex flex-col flex-grow lg:justify-between lg:flex-row">
      <div className={`p-2 mr-2 ${actionText ? 'lg:max-w-[73%]' : ''}`}>
        {title && <H4 className="mb-2">{title}</H4>}
        <Body2>{message}</Body2>
      </div>
      {actionText &&
        (actionHref ? (
          <Button
            asChild
            variant={SEVERITY_VARIANT[severity]}
            className="!text-base lg:self-center lg:mr-2"
          >
            <Link href={actionHref} onClick={actionOnClick}>
              {actionText}
            </Link>
          </Button>
        ) : (
          <Button
            variant={SEVERITY_VARIANT[severity]}
            className="!text-base lg:self-center lg:mr-2"
            onClick={actionOnClick}
          >
            {actionText}
          </Button>
        ))}
    </div>
  </StyledAlert>
)
