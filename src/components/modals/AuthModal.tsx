import React from 'react';
import 'src/styles/components/AuthModal.css'; 

interface AuthModalProps {
  isOpen: boolean;
  closeModal: () => void;
  children: React.ReactNode;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, closeModal, children }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="auth-modal-backdrop">
      <div className="auth-modal-content">
        <button className="close-button" onClick={closeModal}>Close</button>
        {children}
      </div>
    </div>
  );
};

export default AuthModal;
