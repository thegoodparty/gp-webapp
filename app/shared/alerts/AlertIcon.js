import { MdCheckCircle, MdError, MdInfo, MdWarning } from 'react-icons/md'

export const AlertIcon = ({ severity, className }) => {
  switch (severity) {
    case 'error':
      return <MdError className={className} />
    case 'info':
      return <MdInfo className={className} />
    case 'warning':
      return <MdWarning className={className} />
    case 'success':
      return <MdCheckCircle className={className} />
    default:
      return null
  }
}
