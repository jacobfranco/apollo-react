import React from 'react';
import 'src/styles/components/Button.css'; 

interface ButtonProps {
  children: React.ReactNode;
  onClick: ((event: React.FormEvent) => void) | (() => void);
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
