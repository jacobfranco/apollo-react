import{ ReactNode, FC } from 'react';
import 'src/styles/components/AuthModal.css'; 

interface AuthModalProps {
  isOpen: boolean;
  closeModal: () => void;
  children: ReactNode;
}

const AuthModal: FC<AuthModalProps> = ({ isOpen, closeModal, children }) => {
  if (!isOpen) return null;

  return (
    <div className="auth-modal-overlay">
      <div className="auth-modal-content">
        <button className="close-modal" onClick={closeModal}>X</button>
        {children}
      </div>
    </div>
  );
};

export default AuthModal;
