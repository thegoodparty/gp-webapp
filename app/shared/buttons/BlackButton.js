import BaseButton from './BaseButton'

const BlackButton = ({ children, style = {} }) => {
  return (
    <BaseButton style={{ backgroundColor: '#000', color: '#FFF', ...style }}>
      {children}
    </BaseButton>
  )
}

export default BlackButton
