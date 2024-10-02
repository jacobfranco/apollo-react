import { useTheme } from 'src/hooks/useTheme';

type ThemeColors = {
  light: string;
  dark: string;
};

const teamColorData: { [key: string]: ThemeColors } = {
  'Dynamo Eclot': { light: '#EA0A2A', dark: '#EA0A2A' },
  'eSuba': { light: '#0082C9', dark: '#0082C9' },
  'KIA.eSuba Academy': { light: '#0082C9', dark: '#0082C9' },
  'Inside Games': { light: '#000000', dark: '#FFFFFF' },
  'Forsaken': { light: '#000000', dark: '#FFFFFF' },
  // Add other teams as needed
};

export const useTeamColors = () => {
  const theme = useTheme();

  const getTeamColor = (teamName: string): string => {
    const teamColors = teamColorData[teamName];
    if (teamColors) {
      return theme === 'light' ? teamColors.light : teamColors.dark;
    }
    return '#A981FC'; // Default color
  };

  return getTeamColor;
};