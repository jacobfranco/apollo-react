import React, { useState } from 'react';
import { useAppDispatch } from 'src/hooks';
import { login } from 'src/actions/auth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { Button } from 'src/components'
import 'src/styles/features/Login.css';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useAppDispatch();

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    dispatch(login(email, password));
  };

  return (
    <form onSubmit={handleSubmit} className="login-form">
      <h2>Sign in to Apollo</h2>
      <div className="input-container">
        <input 
          type="email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          placeholder="Email" 
        />
      </div>
      <div className="input-container">
        <input 
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <button 
          type="button" 
          className="toggle-password"
          onClick={() => setShowPassword(!showPassword)}
        >
          <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
        </button>
      </div>
      <a href="#" className="forgot-password">Forgot password?</a>
      <br></br>
      <div className="big-button-container">
      <Button variant="primary" onClick={handleSubmit}>Log In</Button>
      </div>
      <p className="signup-prompt">Don't have an account? <a href="#" className="sign-up-link">Sign up</a></p>
      <br></br>
    </form>
  );
};

export default Login;