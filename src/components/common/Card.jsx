import React from 'react';

const Card = ({ children, className = '', bodyClassName = 'p-6', title, action }) => {
  return (
    <div className={`bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden flex flex-col ${className}`}>
      {(title || action) && (
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 backdrop-blur-sm">
          <h3 className="font-semibold text-gray-800">{title}</h3>
          {action && <div>{action}</div>}
        </div>
      )}
      <div className={`flex-1 ${bodyClassName}`}>
        {children}
      </div>
    </div>
  );
};

export default Card;