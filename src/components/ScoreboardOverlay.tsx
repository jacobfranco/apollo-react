import React from 'react';
import { CSSProperties } from 'react';
import { useTheme } from 'src/hooks/useTheme';

interface ScoreboardOverlayProps {
  winningSide: 'left' | 'right';
  winningColor: string;
}

const ScoreboardOverlay: React.FC<ScoreboardOverlayProps> = ({ winningSide, winningColor }) => {
  const theme = useTheme();
  const baseColorWithOpacity = theme === 'dark' ? 'rgba(0, 0, 0, 0)' : 'rgba(255, 255, 255, 0)';

  const gradient = winningSide === 'left'
    ? `linear-gradient(to right, ${winningColor}, ${baseColorWithOpacity})`
    : `linear-gradient(to right, ${baseColorWithOpacity}, ${winningColor})`;

  const overlayStyle: CSSProperties = {
    width: '100%',
    height: '100%',
    background: gradient,
    position: 'absolute',
    top: 0,
    left: 0,
    opacity: 0.5,
    zIndex: 1000,
  };

  return <div style={overlayStyle} />;
};

export default ScoreboardOverlay;
