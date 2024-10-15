import { useTheme } from 'src/hooks/useTheme';

type ThemeColors = {
  light: string;
  dark: string;
};

const teamColorData: { [key: string]: ThemeColors } = {
  'Dynamo Eclot': { light: '#EA0A2A', dark: '#EA0A2A' },
  'eSuba': { light: '#0082C9', dark: '#0082C9' },
  'KIA.eSuba Academy': { light: '#0082C9', dark: '#0082C9' },
  'Inside Games': { light: '#A53CF7', dark: '#A53CF7' },
  'Forsaken': { light: '#000000', dark: '#FFFFFF' },
  'GAM Esports': { light: '#E9C93E', dark: '#E9C93E' },
  'MAD Lions KOI': { light: '#D7B155', dark: '#D7B155' },
  'FlyQuest': { light: '#0B8A4D', dark: '#0B8A4D' },
  'Fnatic': { light: '#FF5800', dark: '#FF5800' },
  'PSG Talon': { light: '#E00040', dark: '#E00040' },
  'TOP Esports': { light: '#FF3E24', dark: '#FF3E24' },
  'Weibo Gaming': { light: '#D22E2F', dark: '#D22E2F' },
  'Hanwha Life Esports': { light: '#F07122', dark: '#F07122' },
  'G2 Esports': { light: '#EE3D23', dark: '#EE3D23' },
  'Dplus KIA': { light: '#000000', dark: '#FFFFFF' },
  'LNG Esports': { light: '#0395FF', dark: '#0395FF' },
  'Diversion Academy': { light: '#FFEC00', dark: '#FFEC00' },
  'EXILE esports Academy': { light: '#26E6A0', dark: '#26E6A0' },
  'Maverix': { light: '#F24A01', dark: '#F24A01' },
  'Fly5': { light: '#000000', dark: '#FFFFFF' },
  'Juicy Ballers': { light: '#FEC48F', dark: '#FEC48F' },
  'Team Meliora': { light: '#00A2FE', dark: '#00A2FE' },
  'EXILE esports': { light: '#26E6A0', dark: '#26E6A0' },
  'Delta Syndicate': { light: '#E3237B', dark: '#E3237B' },
  'Ethereal Enigmas': { light: '#000000', dark: '#FFFFFF' },
  'Esport STUBA': { light: '#000000', dark: '#FFFFFF' },
  'T1': { light: '#F42032', dark: '#F42032' },
  'Gen.G Esports': { light: '#906F12', dark: '#906F12' },
  'Zero Tenacity': { light: '#D71D31', dark: '#D71D31' },
  'Karmine Corp Blue': { light: '#000000', dark: '#FFFFFF' },
  'Vitality.Bee': { light: '#000000', dark: '#FFFFFF' },
  'OGC Esports': { light: '#000000', dark: '#FFFFFF' },
  'Team Liquid': { light: '#0A1723', dark: '#FFFFFF' },
  'Hurricane of Feathers': { light: '#4AC4FE', dark: '#4AC4FE' },
  'Kawaii Kiwis': { light: '#64FD01', dark: '#64FD01' },
  'Parakeet Gaming': { light: '#F21D53', dark: '#F21D53' },
  'GIANTX Academy': { light: '#000000', dark: '#FFFFFF' },
  'eQuizers': { light: '#000000', dark: '#FFFFFF' },
  'Joker Strike': { light: '#A13A8E', dark: '#A13A8E' },
  'AvaTrade PixelPenny': { light: '#FDBF29', dark: '#FDBF29' },
  'Stormbringers': { light: '#000000', dark: '#FFFFFF' },
  'LUA Gaming': { light: '#2DAAE1', dark: '#2DAAE1' },
  'UCAM Esports': { light: '#00437C', dark: '#00437C' },
  'Oxygen Gaming': { light: '#17DBB4', dark: '#17DBB4' },
  'Bilibili Gaming': { light: '#F77096', dark: '#F77096' },
  'Back2TheGame': { light: '#DC1BD4', dark: '#DC1BD4' },
  'paiN Gaming': { light: '#EC2B49', dark: '#EC2B49' },
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