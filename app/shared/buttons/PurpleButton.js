import BaseButton from './BaseButton';

const PurpleButton = ({ children, style = {} }) => {
  return (
    <BaseButton style={{ backgroundColor: '#46002E', color: '#FFF', ...style }}>
      {children}
    </BaseButton>
  );
};

export default PurpleButton;
