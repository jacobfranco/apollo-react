import React from 'react';
import 'src/styles/Button.css'; // Assuming you will create a CSS file for button styles

interface ButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  variant: 'primary' | 'secondary';
}

const Button: React.FC<ButtonProps> = ({ children, onClick, variant }) => {
  return (
    <button className={`button ${variant}`} onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;
