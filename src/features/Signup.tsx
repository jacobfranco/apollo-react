import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toggleAuth } from 'src/actions/auth';
import { useAppDispatch } from 'src/hooks';
import { Button } from 'src/components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import 'src/styles/features/Signup.css';

const Signup: React.FC = () => {

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [month, setMonth] = useState('');
  const [day, setDay] = useState('');
  const [year, setYear] = useState('');
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [profileImage, setProfileImage] = useState<File | null>(null);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Array of months for the dropdown
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  
  // Generate year options (e.g., 1900 to current year)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1899 }, (_, k) => currentYear - k);

  const handleNext = () => {
    setStep(step + 1);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // Handle the signup submission
  };

  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  const handleDisplayNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDisplayName(event.target.value);
  };

  const handleBioChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setBio(event.target.value);
  };

  const handleProfileImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setProfileImage(event.target.files[0]);
    }
  };

  const handleFinish = () => {
    // Here you would usually send the data to your server.
    // For now, we'll use the mock toggleAuth action to simulate authentication.

    // Dispatch the mock authentication action
    dispatch(toggleAuth(true));

    navigate('/home')

  };

  return (
    <form onSubmit={handleSubmit} className="signup-form">
      <label className="step-indicator">Step {step} of 3</label>
      {step === 1 && (
        <>
          <h2>Create your account</h2>
          <div className="input-container">
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
          </div>
          <div className="input-container">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
            />
            <button type="button" className="toggle-password" onClick={togglePasswordVisibility}>
              <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
            </button>
          </div>
          <div className="input-container">
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm Password"
            />
          </div>
          <br></br>
          <label className="dob-label">Date of birth</label> {/* Add this line for the label */}
          <div className="date-of-birth-container">
            <select value={month} onChange={(e) => setMonth(e.target.value)}>
              <option value="">Month</option>
              {months.map(month => <option key={month} value={month}>{month}</option>)}
            </select>
            <select value={day} onChange={(e) => setDay(e.target.value)}>
              <option value="">Day</option>
              {Array.from({ length: 31 }, (_, k) => k + 1).map(day => <option key={day} value={day}>{day}</option>)}
            </select>
            <select value={year} onChange={(e) => setYear(e.target.value)}>
              <option value="">Year</option>
              {years.map(year => <option key={year} value={year}>{year}</option>)}
            </select>
          </div>
          <br></br>
          <div className="big-button-container">
          <Button variant="primary" onClick={handleNext}>Next</Button>
          </div>
        </>
      )}
      {step === 2 && (
        <>
         <h2>Verify your email</h2>
          <div className="input-container">
            <input
              type="text"
              placeholder="Code.."
            />
          </div>
          <div className="big-button-container">
            <Button variant="primary" onClick={handleNext}>Verify</Button>
          </div>
        </>
      )}
      {step === 3 && (
        <>
          <h2>Set up your profile</h2>
          <div className="input-container">
            <input
              type="text"
              value={username}
              onChange={handleUsernameChange}
              placeholder="Username"
            />
          </div>
          <div className="input-container">
            <input
              type="text"
              value={displayName}
              onChange={handleDisplayNameChange}
              placeholder="Display Name"
            />
          </div>
          <div className="input-container">
            <textarea
              value={bio}
              onChange={handleBioChange}
              placeholder="Bio"
            />
          </div>
          <div className="input-container">
            <label htmlFor="profileImageUpload" className="upload-label">
              Upload Profile Picture
              <input
                id="profileImageUpload"
                type="file"
                onChange={handleProfileImageChange}
                style={{ display: 'none' }}
              />
            </label>
            {profileImage && <p>{profileImage.name}</p>}
          </div>
          <div className="big-button-container">
            <Button variant="primary" onClick={handleFinish}>Finish</Button>
          </div>
        </>
      )}
    </form>
  );
};

export default Signup;
