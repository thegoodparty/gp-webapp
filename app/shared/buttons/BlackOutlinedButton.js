import React from 'react';
import Button from '@mui/material/Button';
import styles from './BlackOutlinedButton.module.scss';

const BlackOutlinedButton = ({
  children,
  disabled = false,
  fullWidth = false,
  style = {},
  type = 'button',
  ...props
}) => {
  return (
    <Button
      variant="outlined"
      color="primary"
      fullWidth={fullWidth}
      disabled={disabled}
      style={style}
      type={type}
      className={styles.button}
      {...props}
    >
      <div className="py-0 px-6">{children}</div>
    </Button>
  );
};


export default BlackOutlinedButton;
