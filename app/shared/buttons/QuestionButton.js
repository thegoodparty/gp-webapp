'use client';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import { FaQuestionCircle } from 'react-icons/fa';
import { useState } from 'react';

export default function QuestionButton({ children, className }) {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    event.stopPropagation();
    event.preventDefault();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (event) => {
    event.stopPropagation();
    event.preventDefault();
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
    <div>
      <div onClick={handleClick} className="cursor-pointer">
        <FaQuestionCircle className={className} />
      </div>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <Typography sx={{ p: 2 }}>{children}</Typography>
      </Popover>
    </div>
  );
}
