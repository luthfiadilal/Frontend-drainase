import React from 'react';

const Button = ({ children, variant = 'primary', className = '', ...props }) => {
  const baseStyle = "inline-flex items-center justify-center px-4 py-2 text-sm font-medium transition-all duration-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md hover:-translate-y-0.5 focus:ring-blue-500 shadow-sm",
    secondary: "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 hover:border-gray-300 focus:ring-gray-200 shadow-sm",
    danger: "bg-red-500 text-white hover:bg-red-600 hover:shadow-md focus:ring-red-400 shadow-sm",
    ghost: "text-gray-600 hover:bg-gray-100 focus:ring-gray-200"
  };

  return (
    <button className={`${baseStyle} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

export default Button;