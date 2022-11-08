import BaseButton from './BaseButton';

const BlackButton = ({ children, style = {} }) => {
  return (
    <BaseButton style={{ ...style, backgroundColor: '#000', color: '#FFF' }}>
      {children}
    </BaseButton>
  );
};

export default BlackButton;
