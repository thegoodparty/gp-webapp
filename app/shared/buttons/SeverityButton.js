import InfoButton from '@shared/buttons/InfoButton'
import WarningButtonNew from '@shared/buttons/WarningButtonNew'
import ErrorButton from '@shared/buttons/ErrorButton'
import SuccessButton from '@shared/buttons/SuccessButton'
import PrimaryButton from '@shared/buttons/PrimaryButton'

export const SeverityButton = ({
  children,
  className = '',
  severity = 'info',
  ...restProps
}) => {
  let ButtonComponent = <></>
  switch (severity) {
    case 'info':
      ButtonComponent = InfoButton
      break
    case 'warning':
      ButtonComponent = WarningButtonNew
      break
    case 'error':
      ButtonComponent = ErrorButton
      break
    case 'success':
      ButtonComponent = SuccessButton
      break
    default:
      ButtonComponent = PrimaryButton
  }
  return (
    <ButtonComponent
      className={`
      flex
      items-center
      w-full
      justify-center
      lg:justify-normal
      lg:w-auto
      ${
        severity === 'info'
          ? `
        text-info-contrast
      bg-info
      hover:bg-info-dark`
          : ''
      }
      ${className}
    `}
      size="medium"
      {...restProps}
    >
      {children}
    </ButtonComponent>
  )
}
