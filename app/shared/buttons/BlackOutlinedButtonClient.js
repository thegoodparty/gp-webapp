import React from 'react';
import styles from './BlackOutlinedButton.module.scss';
import BaseButton from './BaseButtonClient';

const BlackOutlinedButtonClient = ({
  children,
  disabled = false,
  fullWidth = false,
  onClick,
  style = {},
  type = 'button',
  ...props
}) => {
  return (
    <BaseButton
      variant="outlined"
      color="primary"
      fullWidth={fullWidth}
      onClick={onClick}
      disabled={disabled}
      style={style}
      type={type}
      className={styles.button}
      {...props}
    >
      <div className="py-0 px-6">{children}</div>
    </BaseButton>
  );
};


export default BlackOutlinedButtonClient;
