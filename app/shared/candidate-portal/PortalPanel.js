import React from 'react';
const PortalPanel = ({ children, color, ...props }) => {
  return (
    <div 
        className="bg-white p-6 relative mb-[10px] lg:px-12 lg:py-9" 
        {...props}
    >
        {
            color && 
            <div 
                className={`absolute top-[34px] left-0 h-7 w-[7px] bg-${color}`}
                style={{backgroundColor: color}}
            />
        }
        {children}
    </div>
  );
};

export default PortalPanel;
