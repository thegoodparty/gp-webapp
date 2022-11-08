import BaseButton from './BaseButton';

const YellowButton = ({ children, style = {} }) => {
  return (
    <BaseButton style={{ ...style, backgroundColor: '#FFE600', color: '#000' }}>
      {children}
    </BaseButton>
  );
};

export default YellowButton;
