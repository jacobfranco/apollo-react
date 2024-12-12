import { useTheme } from "src/hooks/useTheme";

type TeamProps = {
  light: string;
  dark: string;
  logoType: "black" | "white" | "color";
  league?: string;
};

export const teamData: { [key: string]: TeamProps } = {
  "Dynamo Eclot": {
    light: "#EA0A2A",
    dark: "#EA0A2A",
    logoType: "color",
    league: "Hitpoint Masters",
  },
  eSuba: {
    light: "#0082C9",
    dark: "#0082C9",
    logoType: "color",
    league: "Hitpoint Masters",
  },
  "KIA.eSuba Academy": {
    light: "#0082C9",
    dark: "#0082C9",
    logoType: "color",
    league: "Hitpoint 3rd Division",
  },
  "Inside Games": {
    light: "#A53CF7",
    dark: "#A53CF7",
    logoType: "black",
    league: "Hitpoint 2nd Division",
  },
  Forsaken: {
    light: "#03E9FF",
    dark: "#03E9FF",
    logoType: "black",
    league: "Ultraliga",
  },
  "GAM Esports": {
    light: "#E9C93E",
    dark: "#E9C93E",
    logoType: "color",
    league: "LCP",
  },
  "MAD Lions KOI": {
    light: "#D7B155",
    dark: "#D7B155",
    logoType: "color",
    league: "LEC",
  },
  FlyQuest: {
    light: "#0B8A4D",
    dark: "#0B8A4D",
    logoType: "color",
    league: "LTA North",
  },
  Fnatic: {
    light: "#FF5800",
    dark: "#FF5800",
    logoType: "color",
    league: "LEC",
  },
  "PSG Talon": {
    light: "#E00040",
    dark: "#E00040",
    logoType: "color",
    league: "LCP",
  },
  "TOP Esports": {
    light: "#FF3E24",
    dark: "#FF3E24",
    logoType: "color",
    league: "LPL",
  },
  "Weibo Gaming": {
    light: "#D22E2F",
    dark: "#D22E2F",
    logoType: "color",
    league: "LPL",
  },
  "Hanwha Life Esports": {
    light: "#F07122",
    dark: "#F07122",
    logoType: "color",
    league: "LCK",
  },
  "G2 Esports": {
    light: "#EE3D23",
    dark: "#EE3D23",
    logoType: "black",
    league: "LEC",
  },
  "Dplus KIA": {
    light: "#000000",
    dark: "#FFFFFF",
    logoType: "black",
    league: "LCK",
  },
  "LNG Esports": {
    light: "#0395FF",
    dark: "#0395FF",
    logoType: "color",
    league: "LPL",
  },
  "Diversion Gaming": {
    light: "#FFEC00",
    dark: "#FFEC00",
    logoType: "color",
    league: "Hitpoint 2nd Division",
  },
  "Diversion Academy": { light: "#FFEC00", dark: "#FFEC00", logoType: "color" },
  "EXILE esports Academy": {
    light: "#E74BCD",
    dark: "#E74BCD",
    logoType: "color",
  },
  Maverix: {
    light: "#F24A01",
    dark: "#F24A01",
    logoType: "color",
    league: "Hitpoint 2nd Division",
  },
  Fly5: {
    light: "#0349A1",
    dark: "#0349A1",
    logoType: "white",
    league: "Hitpoint 2nd Division",
  },
  "Juicy Ballers": { light: "#FEC48F", dark: "#FEC48F", logoType: "color" },
  "Team Meliora": {
    light: "#00A2FE",
    dark: "#00A2FE",
    logoType: "color",
    league: "Hitpoint 2nd Division",
  },
  "EXILE esports": {
    light: "#E74BCD",
    dark: "#E74BCD",
    logoType: "color",
    league: "Hitpoint 2nd Division",
  },
  "Delta Syndicate": {
    light: "#E3237B",
    dark: "#E3237B",
    logoType: "color",
    league: "Hitpoint 2nd Division",
  },
  "Ethereal Enigmas": { light: "#FF00F3", dark: "#FF00F3", logoType: "black" },
  "Esport STUBA": {
    light: "#AA2239",
    dark: "#AA2239",
    logoType: "black",
    league: "Hitpoint 2nd Division",
  },
  T1: { light: "#F42032", dark: "#F42032", logoType: "color", league: "LCK" },
  "Gen.G Esports": {
    light: "#906F12",
    dark: "#906F12",
    logoType: "color",
    league: "LCK",
  },
  "Zero Tenacity": {
    light: "#D71D31",
    dark: "#D71D31",
    logoType: "color",
    league: "Ultraliga",
  },
  "Karmine Corp Blue": {
    light: "#08B7FF",
    dark: "#08B7FF",
    logoType: "black",
    league: "LLF",
  },
  "Vitality.Bee": {
    light: "#FFFF08",
    dark: "#FFFF08",
    logoType: "black",
    league: "LLF",
  },
  "OGC Esports": {
    light: "#000000",
    dark: "#FFFFFF",
    logoType: "black",
    league: "Hitpoint Masters",
  },
  "Team Liquid": {
    light: "#0A1723",
    dark: "#FFFFFF",
    logoType: "black",
    league: "LTA North",
  },
  "Hurricane of Feathers": {
    light: "#4AC4FE",
    dark: "#4AC4FE",
    logoType: "color",
    league: "Liga Portuguesa",
  },
  "Kawaii Kiwis": {
    light: "#64FD01",
    dark: "#64FD01",
    logoType: "color",
    league: "Liga Nexo",
  },
  "Parakeet Gaming": {
    light: "#F21D53",
    dark: "#F21D53",
    logoType: "color",
    league: "Hitpoint Masters",
  },
  "GIANTX Academy": {
    light: "#000000",
    dark: "#FFFFFF",
    logoType: "black",
    league: "SuperLiga",
  },
  eQuizers: {
    light: "#FFFC00",
    dark: "#FFFC00",
    logoType: "white",
    league: "Liga Nexo",
  },
  "Joker Strike": { light: "#A13A8E", dark: "#A13A8E", logoType: "color" },
  "AvaTrade PixelPenny": {
    light: "#FDBF29",
    dark: "#FDBF29",
    logoType: "color",
  },
  Stormbringers: {
    light: "#00D6FF",
    dark: "#00D6FF",
    logoType: "black",
    league: "SuperLiga 2nd Division",
  },
  "LUA Gaming": {
    light: "#2DAAE1",
    dark: "#2DAAE1",
    logoType: "color",
    league: "SuperLiga",
  },
  "UCAM Esports": {
    light: "#00437C",
    dark: "#00437C",
    logoType: "color",
    league: "SuperLiga",
  },
  "Oxygen Gaming": {
    light: "#17DBB4",
    dark: "#17DBB4",
    logoType: "color",
    league: "Liga Nexo",
  },
  "Bilibili Gaming": {
    light: "#36CFF2",
    dark: "#36CFF2",
    logoType: "color",
    league: "LPL",
  },
  Back2TheGame: {
    light: "#DC1BD4",
    dark: "#DC1BD4",
    logoType: "color",
    league: "Ultraliga",
  },
  "paiN Gaming": {
    light: "#EC2B49",
    dark: "#EC2B49",
    logoType: "color",
    league: "LTA South",
  },
  "Rebels Gaming": {
    light: "#FF0E25",
    dark: "#FF0E25",
    logoType: "color",
    league: "SuperLiga",
  },
  "Guinea Pink": {
    light: "#DC2597",
    dark: "#DC2597",
    logoType: "color",
    league: "Liga Nexo",
  },
  Guasones: {
    light: "#83027C",
    dark: "#83027C",
    logoType: "black",
    league: "SuperLiga",
  },
  "Heracles Gaming": {
    light: "#00919F",
    dark: "#00919F",
    logoType: "black",
    league: "SuperLiga 2nd Division",
  },
  "Rare Atom": {
    light: "#AF4DC3",
    dark: "#AF4DC3",
    logoType: "color",
    league: "LPL",
  },
  "JD Gaming": {
    light: "#C8102E",
    dark: "#C8102E",
    logoType: "color",
    league: "LPL",
  },
  "Ninjas In Pyjamas": {
    light: "#D4FA00",
    dark: "#D4FA00",
    logoType: "color",
    league: "LPL",
  },
  "Mammoth Esports": {
    light: "#FF0000",
    dark: "#FF0000",
    logoType: "color",
    league: "LCO",
  },
  "Antic Esports": {
    light: "#FC12FF",
    dark: "#FC12FF",
    logoType: "color",
    league: "LCO",
  },
  "Team BDS": {
    light: "#FC12FF",
    dark: "#FC12FF",
    logoType: "color",
    league: "LEC",
  },
  "SK Gaming": {
    light: "#4907AC",
    dark: "#4907AC",
    logoType: "black",
    league: "LEC",
  },
  Rogue: {
    light: "#00B3F3",
    dark: "#00B3F3",
    logoType: "color",
    league: "LEC",
  },
  "Karmine Corp": {
    light: "#08CEFF",
    dark: "#08CEFF",
    logoType: "black",
    league: "LEC",
  },
  GIANTX: {
    light: "#0984EC",
    dark: "#0984EC",
    logoType: "black",
    league: "LEC",
  },
  "Team Vitality": {
    light: "#FFFF08",
    dark: "#FFFF08",
    logoType: "black",
    league: "LEC",
  },
  "Team Heretics": {
    light: "#DCA40F",
    dark: "#DCA40F",
    logoType: "black",
    league: "LEC",
  },
  "BNK FearX": {
    light: "#FCE502",
    dark: "#FCE502",
    logoType: "color",
    league: "LCK",
  },
  "BNK FearX Youth": {
    light: "#FCE502",
    dark: "#FCE502",
    logoType: "color",
    league: "LCK Challengers",
  },
  "DRX Challengers": {
    light: "#1203A3",
    dark: "#1203A3",
    logoType: "color",
    league: "LCK Challengers",
  },
  "ION Global Esports": {
    light: "#7E649B",
    dark: "#7E649B",
    logoType: "color",
    league: "LCO",
  },
  "FURY Global": {
    light: "#FE9A51",
    dark: "#FE9A51",
    logoType: "color",
    league: "LCO",
  },
  "Nongshim Esports Academy": {
    light: "#DC2527",
    dark: "#DC2527",
    logoType: "color",
    league: "LCK Challengers",
  },
  "Gen.G Global Academy": {
    light: "#866602",
    dark: "#866602",
    logoType: "color",
    league: "LCK Challengers",
  },
  "Dire Wolves": {
    light: "#00A982",
    dark: "#00A982",
    logoType: "color",
    league: "LCO",
  },
  "Team Bliss": {
    light: "#D56E91",
    dark: "#D56E91",
    logoType: "color",
    league: "LCO",
  },
  "KT Rolster Challengers": {
    light: "#FF0A07",
    dark: "#FF0A07",
    logoType: "color",
    league: "LCK Academy Series",
  },
  "OKSavingsBank BRION Academy": {
    light: "#004C29",
    dark: "#004C29",
    logoType: "color",
    league: "LCK Academy Series",
  },
  "Kanga Esports": {
    light: "#FE6A00",
    dark: "#FE6A00",
    logoType: "color",
    league: "LCO",
  },
  "Ground Zero Gaming": {
    light: "#3D8968",
    dark: "#3D8968",
    logoType: "color",
    league: "LCO",
  },
  "Hanwha Life Esports Challengers": {
    light: "#F17321",
    dark: "#F17321",
    logoType: "color",
    league: "LCK Challengers",
  },
  "Dplus KIA Challengers": {
    light: "#000000",
    dark: "#FFFFFF",
    logoType: "black",
    league: "LCK Challengers",
  },
  "Kwangdong Freecs Challengers": {
    light: "#EC3514",
    dark: "#EC3514",
    logoType: "color",
    league: "LCK Challengers",
  },
  "T1 Academy": {
    light: "#EC012D",
    dark: "#EC012D",
    logoType: "color",
    league: "LCK Academy Series",
  },
  "GRP Esports": {
    light: "#3AD6D1",
    dark: "#3AD6D1",
    logoType: "color",
    league: "Ultraliga",
  },
  "devils.one": {
    light: "#000000",
    dark: "#FFFFFF",
    logoType: "black",
    league: "Ultraliga",
  },
  "Iron Wolves": {
    light: "#6B009B",
    dark: "#6B009B",
    logoType: "color",
    league: "Ultraliga",
  },
  "Orbit Anonymo": {
    light: "#169BD0",
    dark: "#169BD0",
    logoType: "color",
    league: "Ultraliga",
  },
  "Movistar R7": {
    light: "#0197EC",
    dark: "#0197EC",
    logoType: "color",
    league: "LLA",
  },
  "Estral Esports": {
    light: "#F94625",
    dark: "#F94625",
    logoType: "color",
    league: "LLA",
  },
  Isurus: {
    light: "#0093F5",
    dark: "#0093F5",
    logoType: "color",
    league: "LTA South",
  },
  "Infinity Esports": {
    light: "#FE2B00",
    dark: "#FE2B00",
    logoType: "color",
    league: "LLA",
  },
  DRX: { light: "#5A8DFF", dark: "#5A8DFF", logoType: "color", league: "LCK" },
  "Nongshim RedForce": {
    light: "#DC2527",
    dark: "#DC2527",
    logoType: "color",
    league: "LCK",
  },
  "BK ROG Esports": {
    light: "#E90027",
    dark: "#E90027",
    logoType: "color",
    league: "LLF",
  },
  "SK Gaming Prime": {
    light: "#430C9E",
    dark: "#430C9E",
    logoType: "black",
    league: "Prime League",
  },
  "NNO Prime": {
    light: "#9D02F6",
    dark: "#9D02F6",
    logoType: "black",
    league: "Prime League",
  },
  "Barça eSports": {
    light: "#A40044",
    dark: "#A40044",
    logoType: "color",
    league: "SuperLiga",
  },
  "Team GO": {
    light: "#EA0045",
    dark: "#EA0045",
    logoType: "color",
    league: "LLF",
  },
  Aegis: {
    light: "#E2BA4F",
    dark: "#E2BA4F",
    logoType: "color",
    league: "LLF",
  },
  "Ramboot Club": {
    light: "#FEAD03",
    dark: "#FEAD03",
    logoType: "black",
    league: "SuperLiga",
  },
  "Austrian Force willhaben": {
    light: "#D22F2E",
    dark: "#D22F2E",
    logoType: "color",
    league: "Prime League",
  },
  "Eintracht Frankfurt": {
    light: "#CF0209",
    dark: "#CF0209",
    logoType: "color",
    league: "Prime League",
  },
  "Team BDS Academy": {
    light: "#FE0073",
    dark: "#FE0073",
    logoType: "color",
    league: "LLF",
  },
  "Unicorns of Love Sexy Edition": {
    light: "#C25889",
    dark: "#C25889",
    logoType: "color",
    league: "Prime League",
  },
  "Eintracht Spandau": {
    light: "#BA544F",
    dark: "#BA544F",
    logoType: "color",
    league: "Prime League",
  },
  "Los Heretics": {
    light: "#D7A432",
    dark: "#D7A432",
    logoType: "color",
    league: "SuperLiga",
  },
  Solary: {
    light: "#00446E",
    dark: "#00446E",
    logoType: "color",
    league: "LLF",
  },
  "Gentle Mates": {
    light: "#CF95C8",
    dark: "#CF95C8",
    logoType: "black",
    league: "LLF",
  },
  "MOUZ NXT": {
    light: "#FF0000",
    dark: "#FF0000",
    logoType: "color",
    league: "Prime League",
  },
  "E WIE EINFACH E-SPORTS": {
    light: "#FF4593",
    dark: "#FF4593",
    logoType: "black",
    league: "Prime League",
  },
  "Movistar KOI": {
    light: "#009EDF",
    dark: "#009EDF",
    logoType: "color",
    league: "SuperLiga",
  },
  ZETA: {
    light: "#000000",
    dark: "#FFFFFF",
    logoType: "black",
    league: "SuperLiga",
  },
  "Team Du Sud": {
    light: "#44A0DA",
    dark: "#44A0DA",
    logoType: "color",
    league: "LLF",
  },
  GameWard: {
    light: "#413281",
    dark: "#413281",
    logoType: "black",
    league: "LLF",
  },
  "FC Schalke 04 Esports": {
    light: "#0060A9",
    dark: "#0060A9",
    logoType: "color",
    league: "Prime League",
  },
  BIG: {
    light: "#0240E9",
    dark: "#0240E9",
    logoType: "black",
    league: "Prime League",
  },
  Leviatan: {
    light: "#6FB5EA",
    dark: "#6FB5EA",
    logoType: "color",
    league: "LTA South",
  },
  "Six Karma": {
    light: "#CEFD08",
    dark: "#CEFD08",
    logoType: "black",
    league: "LLA",
  },
  FearX: { light: "#FBE402", dark: "#FBE402", logoType: "color" },
  "CTBC Flying Oyster": {
    light: "#FCD40D",
    dark: "#FCD40D",
    logoType: "color",
    league: "LCP",
  },
  "West Point Esports": {
    light: "#6E7AA8",
    dark: "#6E7AA8",
    logoType: "color",
    league: "PCS",
  },
  "Deep Cross Gaming": {
    light: "#0B5DC2",
    dark: "#0B5DC2",
    logoType: "color",
    league: "PCS",
  },
  "Burning Core Toyama": {
    light: "#125CA3",
    dark: "#125CA3",
    logoType: "color",
    league: "LJL",
  },
  "Sengoku Gaming": {
    light: "#BE031E",
    dark: "#BE031E",
    logoType: "color",
    league: "LJL",
  },
  "J Team": {
    light: "#E8517C",
    dark: "#E8517C",
    logoType: "color",
    league: "PCS",
  },
  "Frank Esports": {
    light: "#000000",
    dark: "#FFFFFF",
    logoType: "black",
    league: "PCS",
  },
  "Vikings Esports VN": {
    light: "#521E85",
    dark: "#521E85",
    logoType: "white",
    league: "LCP",
  },
  "Team Secret": {
    light: "#000000",
    dark: "#FFFFFF",
    logoType: "black",
    league: "VCS",
  },
  "Fukuoka SoftBank Hawks gaming": {
    light: "#FBD001",
    dark: "#FBD001",
    logoType: "black",
    league: "LCP",
  },
  "DetonatioN FocusMe": {
    light: "#2568FC",
    dark: "#2568FC",
    logoType: "color",
    league: "LCP",
  },
  "HELL PIGS": {
    light: "#000000",
    dark: "#FFFFFF",
    logoType: "black",
    league: "PCS",
  },
  "MGN Box Esports": {
    light: "#018CEE",
    dark: "#018CEE",
    logoType: "color",
    league: "VCS",
  },
  "AXIZ CREST": {
    light: "#000000",
    dark: "#FFFFFF",
    logoType: "black",
    league: "LJL",
  },
  "V3 Esports": {
    light: "#E44029",
    dark: "#E44029",
    logoType: "color",
    league: "LJL",
  },
  "Vivo Keyd Stars": {
    light: "#5C2A82",
    dark: "#5C2A82",
    logoType: "color",
    league: "LTA South",
  },
  "Los Grandes": { light: "#FF6100", dark: "#FF6100", logoType: "color" },
  Fluxo: {
    light: "#000000",
    dark: "#FFFFFF",
    logoType: "black",
    league: "LTA South",
  },
  "FURIA Esports": {
    light: "#000000",
    dark: "#FFFFFF",
    logoType: "black",
    league: "LTA South",
  },
  Liberty: {
    light: "#00EBEB",
    dark: "#00EBEB",
    logoType: "color",
    league: "CBLOL",
  },
  INTZ: {
    light: "#FFFFFF",
    dark: "#000000",
    logoType: "white",
    league: "CBLOL",
  },
  "100 Thieves": {
    light: "#BF1D30",
    dark: "#BF1D30",
    logoType: "color",
    league: "LTA North",
  },
  "RED Canids": {
    light: "#F3344E",
    dark: "#F3344E",
    logoType: "color",
    league: "LTA South",
  },
  Cloud9: {
    light: "#1792D1",
    dark: "#1792D1",
    logoType: "color",
    league: "LTA North",
  },
  "NRG Esports": {
    light: "#000000",
    dark: "#FFFFFF",
    logoType: "black",
    league: "LCS",
  },
  "Shopify Rebellion": {
    light: "#97E901",
    dark: "#97E901",
    logoType: "black",
    league: "LTA North",
  },
  Dignitas: {
    light: "#FDCD01",
    dark: "#FDCD01",
    logoType: "color",
    league: "LTA North",
  },
  Immortals: {
    light: "#02B1AA",
    dark: "#02B1AA",
    logoType: "color",
    league: "LCS",
  },
  "FlyQuest NZXT": { light: "#0B8A4D", dark: "#0B8A4D", logoType: "color" },
  Disguised: {
    light: "#F4C35E",
    dark: "#F4C35E",
    logoType: "black",
    league: "LTA North",
  },
  "Team Liquid Challengers": {
    light: "#0A1723",
    dark: "#FFFFFF",
    logoType: "black",
  },
  "Kwangdong Freecs": {
    light: "#F43613",
    dark: "#F43613",
    logoType: "color",
    league: "LCK",
  },
  "KT Rolster": {
    light: "#FF0A07",
    dark: "#FF0A07",
    logoType: "color",
    league: "LCK",
  },
  "CERBERUS Esports": {
    light: "#F87A23",
    dark: "#F87A23",
    logoType: "color",
    league: "VCS",
  },
  "Team Whales": {
    light: "#1F3368",
    dark: "#1F3368",
    logoType: "color",
    league: "LCP",
  },
  LOUD: {
    light: "#14FE01",
    dark: "#14FE01",
    logoType: "color",
    league: "LTA South",
  },
  "GTZ Esports": {
    light: "#DA1D37",
    dark: "#DA1D37",
    logoType: "color",
    league: "Liga Portuguesa",
  },
  "KaBuM! eSports": {
    light: "#E97D1D",
    dark: "#E97D1D",
    logoType: "color",
    league: "CBLOL Academy",
  },
  "Royal Never Give Up": {
    light: "#B4926A",
    dark: "#B4926A",
    logoType: "color",
    league: "LPL",
  },
  "Oh My God": {
    light: "#FC9F34",
    dark: "#FC9F34",
    logoType: "color",
    league: "LPL",
  },
  "Anyone's Legend": {
    light: "#C32B2C",
    dark: "#C32B2C",
    logoType: "color",
    league: "LPL",
  },
  GLORE: {
    light: "#B48025",
    dark: "#B48025",
    logoType: "black",
    league: "Hitpoint Masters",
  },
  "Team Brute": {
    light: "#000000",
    dark: "#FFFFFF",
    logoType: "black",
    league: "Hitpoint Masters",
  },
  "Zerolag Esports": {
    light: "#000000",
    dark: "#FFFFFF",
    logoType: "black",
    league: "Greek Legends League",
  },
  "Team Phantasma": {
    light: "#000000",
    dark: "#FFFFFF",
    logoType: "white",
    league: "Greek Legends League",
  },
  "Once Upon A Team": {
    light: "#FB0000",
    dark: "#FB0000",
    logoType: "color",
    league: "Elite Series",
  },
  "A One Man Army": {
    light: "#6EFEFE",
    dark: "#6EFEFE",
    logoType: "color",
    league: "Elite Series",
  },
  "Myth Esports": {
    light: "#C7994A",
    dark: "#C7994A",
    logoType: "color",
    league: "Elite Series",
  },
  "SNOOZE esports": {
    light: "#000000",
    dark: "#FFFFFF",
    logoType: "black",
    league: "Elite Series",
  },
  "mCon esports": {
    light: "#E77222",
    dark: "#E77222",
    logoType: "color",
    league: "Elite Series",
  },
  Dynasty: {
    light: "#C2943C",
    dark: "#C2943C",
    logoType: "color",
    league: "Elite Series",
  },
  "Invictus Gaming": {
    light: "#000000",
    dark: "#FFFFFF",
    logoType: "black",
    league: "LPL",
  },
  "Wild Panthers": {
    light: "#0E0E0E",
    dark: "#0E0E0E",
    logoType: "color",
    league: "Greek Legends League",
  },
  "NORD Esports": {
    light: "#8BD1ED",
    dark: "#8BD1ED",
    logoType: "color",
    league: "NLC",
  },
  LionsCreed: {
    light: "#E95B10",
    dark: "#E95B10",
    logoType: "color",
    league: "NLC",
  },
  "Team Refuse": {
    light: "#45FC44",
    dark: "#45FC44",
    logoType: "color",
    league: "Greek Legends League",
  },
  "Venomcrest Esports": {
    light: "#ACDE07",
    dark: "#ACDE07",
    logoType: "color",
    league: "NLC",
  },
  "Anorthosis Famagusta Esports": {
    light: "#EF4E23",
    dark: "#EF4E23",
    logoType: "color",
    league: "Greek Legends League",
  },
  "Ruddy Esports": {
    light: "#731905",
    dark: "#731905",
    logoType: "color",
    league: "NLC",
  },
  "WLGaming Esports": {
    light: "#FF354E",
    dark: "#FF354E",
    logoType: "color",
    league: "Greek Legends League",
  },
  "ThunderTalk Gaming": {
    light: "#1FB3F2",
    dark: "#1FB3F2",
    logoType: "color",
    league: "LPL",
  },
  "FUT Esports": {
    light: "#FC1B3D",
    dark: "#FC1B3D",
    logoType: "color",
    league: "TCL",
  },
  "Dark Passage": {
    light: "#19375F",
    dark: "#19375F",
    logoType: "color",
    league: "TCL",
  },
  Nativz: {
    light: "#FC27FC",
    dark: "#FC27FC",
    logoType: "color",
    league: "NLC",
  },
  "Macko Esports": {
    light: "#B7A05A",
    dark: "#B7A05A",
    logoType: "color",
    league: "LoL Italian Tournament",
  },
  "Papara SuperMassive": {
    light: "#B32C67",
    dark: "#B32C67",
    logoType: "color",
    league: "TCL",
  },
  "Dsyre Esports": {
    light: "#000000",
    dark: "#FFFFFF",
    logoType: "black",
    league: "LoL Italian Tournament",
  },
  "Keypulse Esports": {
    light: "#FCAB40",
    dark: "#FCAB40",
    logoType: "color",
    league: "Liga Portuguesa",
  },
  "Byteway Esports": {
    light: "#E8602F",
    dark: "#E8602F",
    logoType: "color",
    league: "Liga Portuguesa",
  },
  "BoostGate Esports": {
    light: "#872E88",
    dark: "#872E88",
    logoType: "color",
    league: "TCL",
  },
  Galakticos: {
    light: "#2F3571",
    dark: "#2F3571",
    logoType: "color",
    league: "TCL",
  },
  "Atleta Esport": {
    light: "#35477B",
    dark: "#35477B",
    logoType: "color",
    league: "LoL Italian Tournament",
  },
  ENEMI3S: {
    light: "#CE171B",
    dark: "#CE171B",
    logoType: "color",
    league: "LoL Italian Tournament",
  },
  Verdant: {
    light: "#18A878",
    dark: "#18A878",
    logoType: "color",
    league: "NLC",
  },
  "Odivelas Sports Club": {
    light: "##D8CF3E",
    dark: "#D8CF3E",
    logoType: "color",
    league: "Liga Portuguesa",
  },
  "DREN Esports": {
    light: "#67EFD2",
    dark: "#67EFD2",
    logoType: "color",
    league: "LoL Italian Tournament",
  },
  "EGN Esports": {
    light: "#FFDC00",
    dark: "#FFDC00",
    logoType: "color",
    league: "Liga Portuguesa",
  },
  "Team WE": {
    light: "#9B282D",
    dark: "#9B282D",
    logoType: "color",
    league: "LPL",
  },
  "FunPlus Phoenix": {
    light: "#FE0501",
    dark: "#FE0501",
    logoType: "color",
    league: "LPL",
  },
  "Team UNiTY": {
    light: "#FD3763",
    dark: "#FD3763",
    logoType: "color",
    league: "Hitpoint Masters",
  },
  "NASR eSports Turkey": {
    light: "#F34236",
    dark: "#F34236",
    logoType: "color",
    league: "TCL",
  },
  "aNc Outplayed": {
    light: "#000000",
    dark: "#FFFFFF",
    logoType: "black",
    league: "LoL Italian Tournament",
  },
  Axolotl: {
    light: "#BC64A2",
    dark: "#BC64A2",
    logoType: "color",
    league: "LoL Italian Tournament",
  },
  "Besiktas Esports": {
    light: "#E52220",
    dark: "#E52220",
    logoType: "color",
    league: "TCL",
  },
  "White Dragons": {
    light: "#43BCEB",
    dark: "#43BCEB",
    logoType: "color",
    league: "Liga Portuguesa",
  },
  "EKO Academy": {
    light: "#E4FB2A",
    dark: "#E4FB2A",
    logoType: "color",
    league: "LoL Italian Tournament",
  },
  "LGD Gaming": {
    light: "#FD0002",
    dark: "#FD0002",
    logoType: "color",
    league: "LPL",
  },
  Supernova: {
    light: "#AE8929",
    dark: "#AE8929",
    logoType: "color",
    league: "NACL",
  },
  Entropiq: {
    light: "#00FF93",
    dark: "#00FF93",
    logoType: "color",
    league: "Hitpoint Masters",
  },
  "Gamespace MCE": {
    light: "#0488C0",
    dark: "#0488C0",
    logoType: "color",
    league: "Greek Legends League",
  },
  ZennIT: {
    light: "#821E82",
    dark: "#821E82",
    logoType: "color",
    league: "Elite Series",
  },
  BeFive: {
    light: "#BE0434",
    dark: "#BE0434",
    logoType: "color",
    league: "EBL",
  },
  "Lundqvist Lightside": {
    light: "#00DCE6",
    dark: "#00DCE6",
    logoType: "color",
    league: "NLC",
  },
  "Lupus Esports": {
    light: "#00C6AC",
    dark: "#00C6AC",
    logoType: "color",
    league: "EBL",
  },
  "Diamant Esports": {
    light: "#F17E02",
    dark: "#F17E02",
    logoType: "color",
    league: "Esports Balkan League",
  },
  "SPIKE Syndicate": {
    light: "#D4FB00",
    dark: "#D4FB00",
    logoType: "black",
    league: "Esports Balkan League",
  },
  "Crvena zvezda Esports": {
    light: "#EB2D2E",
    dark: "#EB2D2E",
    logoType: "color",
    league: "Esports Balkan League",
  },
  "Misa Esports": {
    light: "#D6A646",
    dark: "#D6A646",
    logoType: "color",
    league: "TCL",
  },
  "Ultra Prime": {
    light: "#5081D5",
    dark: "#5081D5",
    logoType: "color",
    league: "LPL",
  },
  "Area of Effect Esports": {
    light: "#FED042",
    dark: "#FED042",
    logoType: "color",
    league: "NACL",
  },
  "Furia Academy": {
    light: "#000000",
    dark: "#FFFFFF",
    logoType: "black",
    league: "CBLOL Academy",
  },
  "paiN Gaming Academy": {
    light: "#EF2C4B",
    dark: "#EF2C4B",
    logoType: "color",
    league: "America's Challengers",
  },
  "KaBuM! Academy": {
    light: "#FC5402",
    dark: "#FC5402",
    logoType: "color",
    league: "CBLOL",
  },
  "RED Academy": {
    light: "#ED324C",
    dark: "#ED324C",
    logoType: "color",
    league: "CBLOL Academy",
  },
  "LOUD Academy": {
    light: "#14FE01",
    dark: "#14FE01",
    logoType: "color",
    league: "CBLOL Academy",
  },
  "Keyd Academy": {
    light: "#5C2A82",
    dark: "#5C2A82",
    logoType: "color",
    league: "America's Challengers",
  },
  "Flamengo Academy": {
    light: "#B62022",
    dark: "#B62022",
    logoType: "color",
    league: "CBLOL Academy",
  },
  "Fluxo Academy": {
    light: "#000000",
    dark: "#FFFFFF",
    logoType: "black",
    league: "CBLOL Academy",
  },
  "Los Grandes Academy": {
    light: "#FF5D00",
    dark: "#FF5D00",
    logoType: "color",
    league: "CBLOL",
  },
  "Ankora Gaming": {
    light: "#ED671E",
    dark: "#ED671E",
    logoType: "color",
    league: "Esports Balkan League",
  },
  "Cyber Wolves": {
    light: "#007AFF",
    dark: "#007AFF",
    logoType: "black",
    league: "Esports Balkan League",
  },
  "KRC Genk Esports": {
    light: "#0065FE",
    dark: "#0065FE",
    logoType: "color",
    league: "Elite Series",
  },
  "Liberty Academy": {
    light: "#00E8E7",
    dark: "#00E8E7",
    logoType: "color",
    league: "CBLOL Academy",
  },
  "Ultra Prime Academy": {
    light: "#5081D5",
    dark: "#5081D5",
    logoType: "color",
    league: "LDL",
  },
  "LNG Academy": { light: "#0395FF", dark: "#0395FF", logoType: "color" },
  "Ji Jie Hao": { light: "#C93333", dark: "#C93333", logoType: "color" },
  "FunPlus Phoenix Blaze": {
    light: "#FF0F00",
    dark: "#FF0F00",
    logoType: "color",
  },
  "Bilibili Gaming Junior": {
    light: "#36CFF2",
    dark: "#36CFF2",
    logoType: "color",
  },
  "Top Esports Challenger": {
    light: "#FE3D24",
    dark: "#FE3D24",
    logoType: "color",
    league: "LDL",
  },
  "LGD Gaming Young": {
    light: "#E4080E",
    dark: "#E4080E",
    logoType: "color",
    league: "LDL",
  },
  "MAX E-Sports Club": {
    light: "#64A7D3",
    dark: "#64A7D3",
    logoType: "color",
    league: "LDL",
  },
  "Invictus Gaming Young": {
    light: "#58C9F9",
    dark: "#58C9F9",
    logoType: "color",
  },
  "OKSavingsBank BRION": {
    light: "#01492A",
    dark: "#01492A",
    logoType: "color",
    league: "LCK",
  },
  "Edward Gaming Youth Team": {
    light: "#87D249",
    dark: "#87D249",
    logoType: "color",
    league: "LDL",
  },
  "EDward Gaming": {
    light: "#221814",
    dark: "#221814",
    logoType: "color",
    league: "LPL",
  },
  "Oh My God Academy": {
    light: "#FC9E33",
    dark: "#FC9E33",
    logoType: "color",
    league: "LDL",
  },
  "Royal Club": { light: "#B39368", dark: "#B39368", logoType: "color" },
  "Team WE Academy": {
    light: "#E6061F",
    dark: "#E6061F",
    logoType: "color",
    league: "LDL",
  },
  "Partizan Esports": {
    light: "#EA151C",
    dark: "#EA151C",
    logoType: "color",
    league: "Esports Balkan League",
  },
  "Veni Vidi Vici": {
    light: "#FBD587",
    dark: "#FBD587",
    logoType: "color",
    league: "SuperLiga 2nd Division",
  },
  "IZI Dream": {
    light: "#0779B6",
    dark: "#0779B6",
    logoType: "color",
    league: "LFL Division 2",
  },
  Fuego: {
    light: "#E75617",
    dark: "#E75617",
    logoType: "color",
    league: "America's Challengers",
  },
  "Fear x Starforge": {
    light: "#9626AB",
    dark: "#9626AB",
    logoType: "color",
    league: "America's Challengers",
  },
  Dragonsteel: {
    light: "#81001D",
    dark: "#81001D",
    logoType: "color",
    league: "America's Challengers",
  },
  "WAP Esports": {
    light: "#FC9B13",
    dark: "#FC9B13",
    logoType: "color",
    league: "America's Challengers",
  },
  "Blue Otter": {
    light: "#00639F",
    dark: "#00639F",
    logoType: "color",
    league: "NACL",
  },
  "Winthrop University": {
    light: "#FFB80E",
    dark: "#FFB80E",
    logoType: "color",
    league: "UPL",
  },
  "Ilha das Lendas": {
    light: "#CF76FC",
    dark: "#CF76FC",
    logoType: "color",
    league: "CBLOL Academy",
  },
  MAX: { light: "#64A7D3", dark: "#64A7D3", logoType: "color", league: "LDL" },
  "Geekay Esports": {
    light: "#ECD023",
    dark: "#ECD023",
    logoType: "color",
    league: "Arabian League",
  },
  "Rise Gaming": {
    light: "#000000",
    dark: "#FFFFFF",
    logoType: "black",
    league: "CBLOL Academy",
  },
  "CCG Esports": {
    light: "#D34B29",
    dark: "#D34B29",
    logoType: "color",
    league: "NACL",
  },
  "Weibo Gaming Youth Team": {
    light: "#D22E2E",
    dark: "#D22E2E",
    logoType: "color",
    league: "LDL",
  },
  "Team Flash VN": {
    light: "#F47620",
    dark: "#F47620",
    logoType: "color",
    league: "VCS",
  },
  BlueWhites: {
    light: "#4D87EE",
    dark: "#4D87EE",
    logoType: "color",
    league: "NLC",
  },
  "Twisted Minds": {
    light: "#EA4864",
    dark: "#EA4864",
    logoType: "color",
    league: "Arabian League",
  },
  "Matty LODIS": {
    light: "#1AB1E9",
    dark: "#1AB1E9",
    logoType: "color",
    league: "Ultraliga",
  },
  "Anubis Gaming": {
    light: "#ED1C24",
    dark: "#ED1C24",
    logoType: "color",
    league: "Arabian League",
  },
  "Nigma Galaxy": {
    light: "#502194",
    dark: "#502194",
    logoType: "color",
    league: "Arabian League",
  },
  "Team Paradox": {
    light: "#C90100",
    dark: "#C90100",
    logoType: "color",
    league: "Greek Legends League",
  },
  "Fox Gaming": {
    light: "#FE5213",
    dark: "#FE5213",
    logoType: "color",
    league: "Arabian League",
  },
  "Tropa Raizen": {
    light: "#7D3CA4",
    dark: "#7D3CA4",
    logoType: "color",
    league: "CBLOL Academy",
  },
  "One More Esports": {
    light: "#5A0727",
    dark: "#5A0727",
    logoType: "color",
    league: "Arabian League",
  },
  "SAMCLAN Esports Club": {
    light: "#A21F1F",
    dark: "#A21F1F",
    logoType: "color",
    league: "Liga Portuguesa",
  },
  "Joy Dream": { light: "#E50011", dark: "#E50011", logoType: "color" },
  "GnG Amazigh": {
    light: "#2495D2",
    dark: "#2495D2",
    logoType: "color",
    league: "Arabian League",
  },
  MiaoJing: {
    light: "#A9242A",
    dark: "#A9242A",
    logoType: "color",
    league: "LDL",
  },
  "Anyone's Legend.Young": {
    light: "#C22A2A",
    dark: "#C22A2A",
    logoType: "color",
    league: "LDL",
  },
  "ThunderTalk Gaming Young": {
    light: "#20B9F4",
    dark: "#20B9F4",
    logoType: "color",
    league: "LDL",
  },
  "Rare Atom Period": { light: "#AE4DC3", dark: "#AE4DC3", logoType: "color" },
  "DMG Esports": {
    light: "#011321",
    dark: "#011321",
    logoType: "color",
    league: "NLC",
  },
  "Team Axelent69": {
    light: "#000000",
    dark: "#FFFFFF",
    logoType: "color",
    league: "Esports Balkan League",
  },
  "Ceuta Guardians": {
    light: "#000000",
    dark: "#FFFFFF",
    logoType: "black",
    league: "Liga Nexo",
  },
  "Kiedyś Miałem Fun": {
    light: "#FEE700",
    dark: "#FEE700",
    logoType: "color",
    league: "Ultraliga",
  },
  Regem: {
    light: "#DC424E",
    dark: "#DC424E",
    logoType: "color",
    league: "NLC",
  },
};

export const useTeamData = () => {
  const theme = useTheme();

  const getTeamData = (
    teamName: string
  ): {
    color: string;
    logoType: "black" | "white" | "color";
    league: string | undefined;
  } => {
    const data = teamData[teamName];
    if (data) {
      const color = theme === "light" ? data.light : data.dark;
      return { color, logoType: data.logoType, league: data.league };
    }
    return { color: "#A981FC", logoType: "color", league: "Unknown" }; // Default values
  };

  return getTeamData;
};

const tier1Leagues = ["LTA North", "LTA South", "LCK", "LPL", "LEC", "LCP"];
const tier2Leagues = ["NACL", "LDL", "LCK Challengers", "CD", "LRS", "LCO"];
const tier3Leagues = ["TCL", "EBL", "LRN", "LCO", "LFL", "GLL"];
const tier4Leagues = [
  "Elite Series",
  "NLC",
  "Superliga",
  "Prime League 1st Division",
  "Hitpoint Masters",
  "Liga Nexo",
];
const tier5Leagues = [
  "Hitpoint 2nd Division Challengers",
  "Hitpoint 3rd Division Challengers",
  "NLC 2nd Division",
  "NLC 3rd Division",
  "LVP 2nd Division",
];

export const getLeagueTier = (league: string): 1 | 2 | 3 | 4 | 5 | 6 => {
  if (tier1Leagues.includes(league)) return 1;
  if (tier2Leagues.includes(league)) return 2;
  if (tier3Leagues.includes(league)) return 3;
  if (tier4Leagues.includes(league)) return 4;
  if (tier5Leagues.includes(league)) return 5;
  return 6;
};

export const groupLeaguesByTier = () => {
  const grouped = Object.values(teamData).reduce((acc, team) => {
    if (team.league) {
      const tier = getLeagueTier(team.league);
      if (!acc[tier]) acc[tier] = new Set<string>();
      acc[tier].add(team.league);
    }
    return acc;
  }, {} as Record<number, Set<string>>);

  return {
    1: tier1Leagues.filter((l) => grouped[1]?.has(l)),
    2: tier2Leagues.filter((l) => grouped[2]?.has(l)),
    3: tier3Leagues.filter((l) => grouped[3]?.has(l)),
    4: tier4Leagues.filter((l) => grouped[4]?.has(l)),
    5: tier5Leagues.filter((l) => grouped[5]?.has(l)),
  };
};
