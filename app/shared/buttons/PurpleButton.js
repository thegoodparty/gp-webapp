import BaseButton from './BaseButton'

const PurpleButton = ({ children, style = {}, ...props }) => {
  return (
    <BaseButton
      style={{
        backgroundColor: '#46002E',
        color: '#FFF',
        borderRadius: '40px',
        padding: '16px auto',
        fontWeight: 700,
        ...style,
      }}
      {...props}
    >
      {children}
    </BaseButton>
  )
}

export default PurpleButton
