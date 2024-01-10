import React, { useState } from 'react';
import 'src/styles/layouts/LandingLayout.css'; 
import Background from 'src/components/Background'; 
import Button from 'src/components/Button'; 
import AuthModal from 'src/components/modals/AuthModal';
import Login from 'src/features/Login';
import Signup from 'src/features/Signup'; 

const LandingPage: React.FC = () => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);

  const openLoginModal = () => setIsLoginModalOpen(true);
  const openSignupModal = () => setIsSignupModalOpen(true);

  return (
    <div className="landing-container">
      <Background />
      <div className="left-half">
        <div className="big-logo">
        <img src="src/assets/big_logo.png" alt="Logo" className="logo" />
        </div>
      </div>
      <div className="right-half">
        <h1>The Gaming Frontier</h1>
        <h3>Sign up today.</h3>
        <div className="button-container">
        <Button onClick={openSignupModal} variant={'primary'}>Create Account</Button>
        </div>
        <h4>Already have an account?</h4>
        <div className="button-container">
        <Button onClick={openLoginModal} variant={'secondary'}>Sign In</Button>
        </div>
      </div>

      <AuthModal isOpen={isSignupModalOpen} closeModal={() => setIsSignupModalOpen(false)}>
        <Signup />
      </AuthModal>

      <AuthModal isOpen={isLoginModalOpen} closeModal={() => setIsLoginModalOpen(false)}>
        <Login />
      </AuthModal>
    </div>
  );
};

export default LandingPage;
