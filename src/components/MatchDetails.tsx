// components/MatchDetails.tsx
import React from 'react';

interface MatchDetailsProps {
  duration: string;
  status: string;
}

const MatchDetails: React.FC<MatchDetailsProps> = ({ duration, status }) => (
  <div className="text-center p-2">
    <div>{status}</div>
    <div>{duration}</div>
  </div>
);

export default MatchDetails;
