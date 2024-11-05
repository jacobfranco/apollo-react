import { useTheme } from "src/hooks/useTheme";

type ThemeColors = {
  light: string;
  dark: string;
  logoType: "black" | "white" | "color";
};

const teamColorData: { [key: string]: ThemeColors } = {
  "Dynamo Eclot": { light: "#EA0A2A", dark: "#EA0A2A", logoType: "color" },
  eSuba: { light: "#0082C9", dark: "#0082C9", logoType: "color" },
  "KIA.eSuba Academy": { light: "#0082C9", dark: "#0082C9", logoType: "color" },
  "Inside Games": { light: "#A53CF7", dark: "#A53CF7", logoType: "black" },
  Forsaken: { light: "#03E9FF", dark: "#03E9FF", logoType: "black" },
  "GAM Esports": { light: "#E9C93E", dark: "#E9C93E", logoType: "color" },
  "MAD Lions KOI": { light: "#D7B155", dark: "#D7B155", logoType: "color" },
  FlyQuest: { light: "#0B8A4D", dark: "#0B8A4D", logoType: "color" },
  Fnatic: { light: "#FF5800", dark: "#FF5800", logoType: "color" },
  "PSG Talon": { light: "#E00040", dark: "#E00040", logoType: "color" },
  "TOP Esports": { light: "#FF3E24", dark: "#FF3E24", logoType: "color" },
  "Weibo Gaming": { light: "#D22E2F", dark: "#D22E2F", logoType: "color" },
  "Hanwha Life Esports": {
    light: "#F07122",
    dark: "#F07122",
    logoType: "color",
  },
  "G2 Esports": { light: "#EE3D23", dark: "#EE3D23", logoType: "black" },
  "Dplus KIA": { light: "#000000", dark: "#FFFFFF", logoType: "black" },
  "LNG Esports": { light: "#0395FF", dark: "#0395FF", logoType: "color" },
  "Diversion Academy": { light: "#FFEC00", dark: "#FFEC00", logoType: "color" },
  "EXILE esports Academy": {
    light: "#E74BCD",
    dark: "#E74BCD",
    logoType: "color",
  },
  Maverix: { light: "#F24A01", dark: "#F24A01", logoType: "color" },
  Fly5: { light: "#0349A1", dark: "#0349A1", logoType: "white" },
  "Juicy Ballers": { light: "#FEC48F", dark: "#FEC48F", logoType: "color" },
  "Team Meliora": { light: "#00A2FE", dark: "#00A2FE", logoType: "color" },
  "EXILE esports": { light: "#E74BCD", dark: "#E74BCD", logoType: "color" },
  "Delta Syndicate": { light: "#E3237B", dark: "#E3237B", logoType: "color" },
  "Ethereal Enigmas": { light: "#FF00F3", dark: "#FF00F3", logoType: "black" },
  "Esport STUBA": { light: "#AA2239", dark: "#AA2239", logoType: "black" },
  T1: { light: "#F42032", dark: "#F42032", logoType: "color" },
  "Gen.G Esports": { light: "#906F12", dark: "#906F12", logoType: "color" },
  "Zero Tenacity": { light: "#D71D31", dark: "#D71D31", logoType: "color" },
  "Karmine Corp Blue": { light: "#08B7FF", dark: "#08B7FF", logoType: "black" },
  "Vitality.Bee": { light: "#FFFF08", dark: "#FFFF08", logoType: "black" },
  "OGC Esports": { light: "#000000", dark: "#FFFFFF", logoType: "black" },
  "Team Liquid": { light: "#0A1723", dark: "#FFFFFF", logoType: "black" },
  "Hurricane of Feathers": {
    light: "#4AC4FE",
    dark: "#4AC4FE",
    logoType: "color",
  },
  "Kawaii Kiwis": { light: "#64FD01", dark: "#64FD01", logoType: "color" },
  "Parakeet Gaming": { light: "#F21D53", dark: "#F21D53", logoType: "color" },
  "GIANTX Academy": { light: "#000000", dark: "#FFFFFF", logoType: "black" },
  eQuizers: { light: "#FFFC00", dark: "#FFFC00", logoType: "black" },
  "Joker Strike": { light: "#A13A8E", dark: "#A13A8E", logoType: "color" },
  "AvaTrade PixelPenny": {
    light: "#FDBF29",
    dark: "#FDBF29",
    logoType: "color",
  },
  Stormbringers: { light: "#00D6FF", dark: "#00D6FF", logoType: "black" },
  "LUA Gaming": { light: "#2DAAE1", dark: "#2DAAE1", logoType: "color" },
  "UCAM Esports": { light: "#00437C", dark: "#00437C", logoType: "color" },
  "Oxygen Gaming": { light: "#17DBB4", dark: "#17DBB4", logoType: "color" },
  "Bilibili Gaming": { light: "#36CFF2", dark: "#36CFF2", logoType: "color" },
  Back2TheGame: { light: "#DC1BD4", dark: "#DC1BD4", logoType: "color" },
  "paiN Gaming": { light: "#EC2B49", dark: "#EC2B49", logoType: "color" },
  "Rebels Gaming": { light: "#FF0E25", dark: "#FF0E25", logoType: "color" },
  "Guinea Pink": { light: "#DC2597", dark: "#DC2597", logoType: "color" },
  Guasones: { light: "#83027C", dark: "#83027C", logoType: "black" },
  "Heracles Gaming": { light: "#00919F", dark: "#00919F", logoType: "black" },
  "Rare Atom": { light: "#AF4DC3", dark: "#AF4DC3", logoType: "color" },
  "JD Gaming": { light: "#C8102E", dark: "#C8102E", logoType: "color" },
  "Ninjas In Pyjamas": { light: "#D4FA00", dark: "#D4FA00", logoType: "color" },
  "Mammoth Esports": { light: "#FF0000", dark: "#FF0000", logoType: "color" },
  "Antic Esports": { light: "#FC12FF", dark: "#FC12FF", logoType: "color" },
  "Team BDS": { light: "#FC12FF", dark: "#FC12FF", logoType: "color" },
  "SK Gaming": { light: "#4907AC", dark: "#4907AC", logoType: "black" },
  Rogue: { light: "#00B3F3", dark: "#00B3F3", logoType: "color" },
  "Karmine Corp": { light: "#08CEFF", dark: "#08CEFF", logoType: "black" },
  GIANTX: { light: "#0984EC", dark: "#0984EC", logoType: "black" },
  "Team Vitality": { light: "#FFFF08", dark: "#FFFF08", logoType: "black" },
  "Team Heretics": { light: "#DCA40F", dark: "#DCA40F", logoType: "black" },
  "BNK FearX Youth": { light: "#FCE502", dark: "#FCE502", logoType: "color" },
  "DRX Challengers": { light: "#1203A3", dark: "#1203A3", logoType: "color" },
  "ION Global Esports": {
    light: "#7E649B",
    dark: "#7E649B",
    logoType: "color",
  },
  "FURY Global": { light: "#FE9A51", dark: "#FE9A51", logoType: "color" },
  "Nongshim Esports Academy": {
    light: "#DC2527",
    dark: "#DC2527",
    logoType: "color",
  },
  "Gen.G Global Academy": {
    light: "#866602",
    dark: "#866602",
    logoType: "color",
  },
  "Dire Wolves": { light: "#00A982", dark: "#00A982", logoType: "color" },
  "Team Bliss": { light: "#D56E91", dark: "#D56E91", logoType: "color" },
  "KT Rolster Challengers": {
    light: "#FF0A07",
    dark: "#FF0A07",
    logoType: "color",
  },
  "OKSavingsBank BRION Challengers": {
    light: "#004C29",
    dark: "#004C29",
    logoType: "color",
  },
  "Kanga Esports": { light: "#FE6A00", dark: "#FE6A00", logoType: "color" },
  "Ground Zero Gaming": {
    light: "#3D8968",
    dark: "#3D8968",
    logoType: "color",
  },
  "Hanwha Life Esports Challengers": {
    light: "#F17321",
    dark: "#F17321",
    logoType: "color",
  },
  "Dplus KIA Challengers": {
    light: "#000000",
    dark: "#FFFFFF",
    logoType: "black",
  },
  "Kwangdong Freecs Challengers": {
    light: "#EC3514",
    dark: "#EC3514",
    logoType: "color",
  },
  "T1 Esports Academy": {
    light: "#EC012D",
    dark: "#EC012D",
    logoType: "color",
  },
  "GRP Esports": { light: "#3AD6D1", dark: "#3AD6D1", logoType: "color" },
  "devils.one": { light: "#000000", dark: "#FFFFFF", logoType: "black" },
  "Iron Wolves": { light: "#6B009B", dark: "#6B009B", logoType: "color" },
  "Orbit Anonymo": { light: "#169BD0", dark: "#169BD0", logoType: "color" },
  "Movistar R7": { light: "#0197EC", dark: "#0197EC", logoType: "color" },
  "Estral Esports": { light: "#F94625", dark: "#F94625", logoType: "color" },
  Isurus: { light: "#0093F5", dark: "#0093F5", logoType: "color" },
  "Infinity Esports": { light: "#FE2B00", dark: "#FE2B00", logoType: "color" },
  DRX: { light: "#5A8DFF", dark: "#5A8DFF", logoType: "color" },
  "Nongshim RedForce": { light: "#DC2527", dark: "#DC2527", logoType: "color" },
  "BK ROG Esports": { light: "#E90027", dark: "#E90027", logoType: "color" },
  "SK Gaming Prime": { light: "#430C9E", dark: "#430C9E", logoType: "black" },
  "NNO Prime": { light: "#9D02F6", dark: "#9D02F6", logoType: "black" },
  "Barça eSports": { light: "#A40044", dark: "#A40044", logoType: "color" },
  "Team GO": { light: "#EA0045", dark: "#EA0045", logoType: "color" },
  Aegis: { light: "#E2BA4F", dark: "#E2BA4F", logoType: "color" },
  "Ramboot Club": { light: "#FEAD03", dark: "#FEAD03", logoType: "black" },
  "Austrian Force willhaben": {
    light: "#D22F2E",
    dark: "#D22F2E",
    logoType: "color",
  },
  "Eintracht Frankfurt": {
    light: "#CF0209",
    dark: "#CF0209",
    logoType: "color",
  },
  "Team BDS Academy": { light: "#FE0073", dark: "#FE0073", logoType: "color" },
  "Unicorns of Love Sexy Edition": {
    light: "#C25889",
    dark: "#C25889",
    logoType: "color",
  },
  "Eintracht Spandau": { light: "#BA544F", dark: "#BA544F", logoType: "color" },
  "Los Heretics": { light: "#D7A432", dark: "#D7A432", logoType: "color" },
  Solary: { light: "#00446E", dark: "#00446E", logoType: "color" },
  "Gentle Mates": { light: "#CF95C8", dark: "#CF95C8", logoType: "black" },
  "MOUZ NXT": { light: "#FF0000", dark: "#FF0000", logoType: "color" },
  "E WIE EINFACH E-SPORTS": {
    light: "#FF4593",
    dark: "#FF4593",
    logoType: "black",
  },
  "Movistar KOI": { light: "#009EDF", dark: "#009EDF", logoType: "color" },
  ZETA: { light: "#000000", dark: "#FFFFFF", logoType: "black" },
  "Team Du Sud": { light: "#44A0DA", dark: "#44A0DA", logoType: "color" },
  GameWard: { light: "#413281", dark: "#413281", logoType: "black" },
  "FC Schalke 04 Esports": {
    light: "#0060A9",
    dark: "#0060A9",
    logoType: "color",
  },
  BIG: { light: "#0240E9", dark: "#0240E9", logoType: "black" },
  Leviatan: { light: "#6FB5EA", dark: "#6FB5EA", logoType: "color" },
  "Six Karma": { light: "#CEFD08", dark: "#CEFD08", logoType: "black" },
  FearX: { light: "#FBE402", dark: "#FBE402", logoType: "color" },
  "CTBC Flying Oyster": {
    light: "#FCD40D",
    dark: "#FCD40D",
    logoType: "color",
  },
  "West Point Esports": {
    light: "#6E7AA8",
    dark: "#6E7AA8",
    logoType: "color",
  },
  "Deep Cross Gaming": { light: "#0B5DC2", dark: "#0B5DC2", logoType: "color" },
  "Burning Core Toyama": {
    light: "#125CA3",
    dark: "#125CA3",
    logoType: "color",
  },
  "Sengoku Gaming": { light: "#BE031E", dark: "#BE031E", logoType: "color" },
  "J Team": { light: "#E8517C", dark: "#E8517C", logoType: "color" },
  "Frank Esports": { light: "#000000", dark: "#FFFFFF", logoType: "black" },
  "Vikings Esports VN": {
    light: "#521E85",
    dark: "#521E85",
    logoType: "white",
  },
  "Team Secret": { light: "#000000", dark: "#FFFFFF", logoType: "black" },
  "Fukuoka SoftBank Hawks gaming": {
    light: "#FBD001",
    dark: "#FBD001",
    logoType: "black",
  },
  "DetonatioN FocusMe": {
    light: "#2568FC",
    dark: "#2568FC",
    logoType: "color",
  },
  "HELL PIGS": { light: "#000000", dark: "#FFFFFF", logoType: "black" },
  "MGN Box Esports": { light: "#018CEE", dark: "#018CEE", logoType: "color" },
  "AXIZ CREST": { light: "#000000", dark: "#FFFFFF", logoType: "black" },
  "V3 Esports": { light: "#E44029", dark: "#E44029", logoType: "color" },
  "Vivo Keyd Stars": { light: "#5C2A82", dark: "#5C2A82", logoType: "color" },
  "Los Grandes": { light: "#FF6100", dark: "#FF6100", logoType: "color" },
  Fluxo: { light: "#000000", dark: "#FFFFFF", logoType: "black" },
  "FURIA Esports": { light: "#000000", dark: "#FFFFFF", logoType: "black" },
  Liberty: { light: "#00EBEB", dark: "#00EBEB", logoType: "color" },
  INTZ: { light: "#FFFFFF", dark: "#000000", logoType: "white" },
  "100 Thieves": { light: "#BF1D30", dark: "#BF1D30", logoType: "color" },
  "RED Canids": { light: "#F3344E", dark: "#F3344E", logoType: "color" },
  Cloud9: { light: "#1792D1", dark: "#1792D1", logoType: "color" },
  "NRG Esports": { light: "#000000", dark: "#FFFFFF", logoType: "black" },
  "Shopify Rebellion": { light: "#97E901", dark: "#97E901", logoType: "black" },
  Dignitas: { light: "#FDCD01", dark: "#FDCD01", logoType: "color" },
  Immortals: { light: "#02B1AA", dark: "#02B1AA", logoType: "color" },
  "FlyQuest NZXT": { light: "#0B8A4D", dark: "#0B8A4D", logoType: "color" },
  Disguised: { light: "#F4C35E", dark: "#F4C35E", logoType: "black" },
  "Team Liquid Challengers": {
    light: "#0A1723",
    dark: "#FFFFFF",
    logoType: "black",
  },
  "Kwangdong Freecs": { light: "#F43613", dark: "#F43613", logoType: "color" },
  "KT Rolster": { light: "#FF0A07", dark: "#FF0A07", logoType: "color" },
  "CERBERUS Esports": { light: "#F87A23", dark: "#F87A23", logoType: "color" },
  "Team Whales": { light: "#1F3368", dark: "#1F3368", logoType: "color" },
  LOUD: { light: "#14FE01", dark: "#14FE01", logoType: "color" },
  "GTZ Esports": { light: "#DA1D37", dark: "#DA1D37", logoType: "color" },
  "KaBuM! eSports": { light: "#E97D1D", dark: "#E97D1D", logoType: "color" },
  "Royal Never Give Up": {
    light: "#B4926A",
    dark: "#B4926A",
    logoType: "color",
  },
  "Oh My God": { light: "#FC9F34", dark: "#FC9F34", logoType: "color" },
  "Anyone's Legend": { light: "#C32B2C", dark: "#C32B2C", logoType: "color" },
  GLORE: { light: "#B48025", dark: "#B48025", logoType: "black" },
  "Team Brute": { light: "#000000", dark: "#FFFFFF", logoType: "black" },
  "Zerolag Esports": { light: "#000000", dark: "#FFFFFF", logoType: "black" },
  "Team Phantasma": { light: "#000000", dark: "#FFFFFF", logoType: "white" },
  "Once Upon A Team": { light: "#FB0000", dark: "#FB0000", logoType: "color" },
  "A One Man Army": { light: "#6EFEFE", dark: "#6EFEFE", logoType: "color" },
  "Myth Esports": { light: "#C7994A", dark: "#C7994A", logoType: "color" },
  "SNOOZE esports": { light: "#000000", dark: "#FFFFFF", logoType: "black" },
  "mCon esports": { light: "#E77222", dark: "#E77222", logoType: "color" },
  Dynasty: { light: "#C2943C", dark: "#C2943C", logoType: "color" },
  "Invictus Gaming": { light: "#000000", dark: "#FFFFFF", logoType: "black" },
  "Wild Panthers": { light: "#0E0E0E", dark: "#0E0E0E", logoType: "color" },
  "NORD Esports": { light: "#8BD1ED", dark: "#8BD1ED", logoType: "color" },
  LionsCreed: { light: "#E95B10", dark: "#E95B10", logoType: "color" },
  "Team Refuse": { light: "#45FC44", dark: "#45FC44", logoType: "color" },
  "Venomcrest Esports": {
    light: "#ACDE07",
    dark: "#ACDE07",
    logoType: "color",
  },
  "Anorthosis Famagusta Esports": {
    light: "#EF4E23",
    dark: "#EF4E23",
    logoType: "color",
  },
  "Ruddy Esports": { light: "#731905", dark: "#731905", logoType: "color" },
  "WLGaming Esports": { light: "#FF354E", dark: "#FF354E", logoType: "color" },
  "ThunderTalk Gaming": {
    light: "#1FB3F2",
    dark: "#1FB3F2",
    logoType: "color",
  },
  "FUT Esports": { light: "#FC1B3D", dark: "#FC1B3D", logoType: "color" },
  "Dark Passage": { light: "#19375F", dark: "#19375F", logoType: "color" },
  Nativz: { light: "#FC27FC", dark: "#FC27FC", logoType: "color" },
  "Macko Esports": { light: "#B7A05A", dark: "#B7A05A", logoType: "color" },
  "Papara SuperMassive": {
    light: "#B32C67",
    dark: "#B32C67",
    logoType: "color",
  },
  "Dsyre Esports": { light: "#000000", dark: "#FFFFFF", logoType: "black" },
  "Keypulse Esports": { light: "#FCAB40", dark: "#FCAB40", logoType: "color" },
  "Byteway Esports": { light: "#E8602F", dark: "#E8602F", logoType: "color" },
  "BoostGate Esports": { light: "#872E88", dark: "#872E88", logoType: "color" },
  Galakticos: { light: "#2F3571", dark: "#2F3571", logoType: "color" },
  "Atleta Esport": { light: "#35477B", dark: "#35477B", logoType: "color" },
  ENEMI3S: { light: "#CE171B", dark: "#CE171B", logoType: "color" },
  Verdant: { light: "#18A878", dark: "#18A878", logoType: "color" },
  "Odivelas Sports Club": {
    light: "##D8CF3E",
    dark: "#D8CF3E",
    logoType: "color",
  },
  "DREN Esports": { light: "#67EFD2", dark: "#67EFD2", logoType: "color" },
  "EGN Esports": { light: "#FFDC00", dark: "#FFDC00", logoType: "color" },
  "Team WE": { light: "#9B282D", dark: "#9B282D", logoType: "color" },
  "FunPlus Phoenix": { light: "#FE0501", dark: "#FE0501", logoType: "color" },
  "Team UNiTY": { light: "#FD3763", dark: "#FD3763", logoType: "color" },
  "NASR eSports Turkey": {
    light: "#F34236",
    dark: "#F34236",
    logoType: "color",
  },
  "aNc Outplayed": { light: "#000000", dark: "#FFFFFF", logoType: "black" },
  Axolotl: { light: "#BC64A2", dark: "#BC64A2", logoType: "color" },
  "Besiktas Esports": { light: "#E52220", dark: "#E52220", logoType: "color" },
  "White Dragons": { light: "#43BCEB", dark: "#43BCEB", logoType: "color" },
  "EKO Academy": { light: "#E4FB2A", dark: "#E4FB2A", logoType: "color" },
  "LGD Gaming": { light: "#FD0002", dark: "#FD0002", logoType: "color" },
  Supernova: { light: "#AE8929", dark: "#AE8929", logoType: "color" },
  Entropiq: { light: "#00FF93", dark: "#00FF93", logoType: "color" },
  "Gamespace MCE": { light: "#0488C0", dark: "#0488C0", logoType: "color" },
  ZennIT: { light: "#821E82", dark: "#821E82", logoType: "color" },
  BeFive: { light: "#BE0434", dark: "#BE0434", logoType: "color" },
  "Lundqvist Lightside": {
    light: "#00DCE6",
    dark: "#00DCE6",
    logoType: "color",
  },
  "Lupus Esports": { light: "#00C6AC", dark: "#00C6AC", logoType: "color" },
  "Diamant Esports": { light: "#F17E02", dark: "#F17E02", logoType: "color" },
  "SPIKE Syndicate": { light: "#D4FB00", dark: "#D4FB00", logoType: "black" },
  "Crvena zvezda Esports": {
    light: "#EB2D2E",
    dark: "#EB2D2E",
    logoType: "color",
  },
  "Misa Esports": { light: "#D6A646", dark: "#D6A646", logoType: "color" },
  "Ultra Prime": { light: "#5081D5", dark: "#5081D5", logoType: "color" },
  "Area of Effect Esports": {
    light: "#FED042",
    dark: "#FED042",
    logoType: "color",
  },
  "Furia Academy": { light: "#000000", dark: "#FFFFFF", logoType: "black" },
  "paiN Gaming Academy": {
    light: "#EF2C4B",
    dark: "#EF2C4B",
    logoType: "color",
  },
  "KaBuM! Academy": { light: "#FC5402", dark: "#FC5402", logoType: "color" },
  "RED Academy": { light: "#ED324C", dark: "#ED324C", logoType: "color" },
  "LOUD Academy": { light: "#14FE01", dark: "#14FE01", logoType: "color" },
  "Keyd Academy": { light: "#5C2A82", dark: "#5C2A82", logoType: "color" },
  "Flamengo Academy": { light: "#B62022", dark: "#B62022", logoType: "color" },
  "Fluxo Academy": { light: "#000000", dark: "#FFFFFF", logoType: "black" },
  "Los Grandes Academy": {
    light: "#FF5D00",
    dark: "#FF5D00",
    logoType: "color",
  },
  "Ankora Gaming": { light: "#ED671E", dark: "#ED671E", logoType: "color" },
  "Cyber Wolves": { light: "#007AFF", dark: "#007AFF", logoType: "black" },
  "KRC Genk Esports": { light: "#0065FE", dark: "#0065FE", logoType: "color" },
  "Liberty Academy": { light: "#00E8E7", dark: "#00E8E7", logoType: "color" },
  "Ultra Prime Academy": {
    light: "#5081D5",
    dark: "#5081D5",
    logoType: "color",
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
  },
  "LGD Gaming Young": { light: "#E4080E", dark: "#E4080E", logoType: "color" },
  "MAX E-Sports Club": { light: "#64A7D3", dark: "#64A7D3", logoType: "color" },
  "Invictus Gaming Young": {
    light: "#58C9F9",
    dark: "#58C9F9",
    logoType: "color",
  },
  "OKSavingsBank BRION": {
    light: "#01492A",
    dark: "#01492A",
    logoType: "color",
  },
  "Edward Gaming Youth Team": {
    light: "#87D249",
    dark: "#87D249",
    logoType: "color",
  },
  "EDward Gaming": { light: "#221814", dark: "#221814", logoType: "color" },
  "Oh My God Academy": { light: "#FC9E33", dark: "#FC9E33", logoType: "color" },
  "Royal Club": { light: "#B39368", dark: "#B39368", logoType: "color" },
  "Team WE Academy": { light: "#E6061F", dark: "#E6061F", logoType: "color" },
  "Partizan Esports": { light: "#EA151C", dark: "#EA151C", logoType: "color" },
  "Veni Vidi Vici": { light: "#FBD587", dark: "#FBD587", logoType: "color" },
  "IZI Dream": { light: "#0779B6", dark: "#0779B6", logoType: "color" },
  Fuego: { light: "#E75617", dark: "#E75617", logoType: "color" },
  "Fear x Starforge": { light: "#9626AB", dark: "#9626AB", logoType: "color" },
  Dragonsteel: { light: "#81001D", dark: "#81001D", logoType: "color" },
  "WAP Esports": { light: "#FC9B13", dark: "#FC9B13", logoType: "color" },
  "Blue Otter": { light: "#00639F", dark: "#00639F", logoType: "color" },
  "Winthrop University": {
    light: "#FFB80E",
    dark: "#FFB80E",
    logoType: "color",
  },
  "Ilha das Lendas": { light: "#CF76FC", dark: "#CF76FC", logoType: "color" },
  MAX: { light: "#64A7D3", dark: "#64A7D3", logoType: "color" },
  "Geekay Esports": { light: "#ECD023", dark: "#ECD023", logoType: "color" },
  "Rise Gaming": { light: "#000000", dark: "#FFFFFF", logoType: "black" },
  "CCG Esports": { light: "#D34B29", dark: "#D34B29", logoType: "color" },
  "Weibo Gaming Youth Team": {
    light: "#D22E2E",
    dark: "#D22E2E",
    logoType: "color",
  },
  "Team Flash VN": { light: "#F47620", dark: "#F47620", logoType: "color" },
  BlueWhites: { light: "#4D87EE", dark: "#4D87EE", logoType: "color" },
  "Twisted Minds": { light: "#EA4864", dark: "#EA4864", logoType: "color" },
  "Matty LODIS": { light: "#1AB1E9", dark: "#1AB1E9", logoType: "color" },
  "Anubis Gaming": { light: "#ED1C24", dark: "#ED1C24", logoType: "color" },
  "Nigma Galaxy": { light: "#502194", dark: "#502194", logoType: "color" },
  "Team Paradox": { light: "#C90100", dark: "#C90100", logoType: "color" },
  "Fox Gaming": { light: "#FE5213", dark: "#FE5213", logoType: "color" },
  "Tropa Raizen": { light: "#7D3CA4", dark: "#7D3CA4", logoType: "color" },
  "One More Esports": { light: "#5A0727", dark: "#5A0727", logoType: "color" },
  "SAMCLAN Esports Club": {
    light: "#A21F1F",
    dark: "#A21F1F",
    logoType: "color",
  },
  "Joy Dream": { light: "#E50011", dark: "#E50011", logoType: "color" },
  "GnG Amazigh": { light: "#2495D2", dark: "#2495D2", logoType: "color" },
  MiaoJing: { light: "#A9242A", dark: "#A9242A", logoType: "color" },
  "Anyone's Legend.Young": {
    light: "#C22A2A",
    dark: "#C22A2A",
    logoType: "color",
  },
  "ThunderTalk Gaming Young": {
    light: "#20B9F4",
    dark: "#20B9F4",
    logoType: "color",
  },
  "Rare Atom Period": { light: "#AE4DC3", dark: "#AE4DC3", logoType: "color" },
  "DMG Esports": { light: "#011321", dark: "#011321", logoType: "color" },
  "Ceuta Guardians": { light: "#000000", dark: "#FFFFFF", logoType: "black" },
  "Kiedyś Miałem Fun": { light: "#FEE700", dark: "#FEE700", logoType: "color" },
  Regem: { light: "#DC424E", dark: "#DC424E", logoType: "color" },
};

export const useTeamColors = () => {
  const theme = useTheme();

  const getTeamColorAndLogoType = (
    teamName: string
  ): { color: string; logoType: "black" | "white" | "color" } => {
    const teamData = teamColorData[teamName];
    if (teamData) {
      const color = theme === "light" ? teamData.light : teamData.dark;
      return { color, logoType: teamData.logoType };
    }
    return { color: "#A981FC", logoType: "color" }; // Default values
  };

  return getTeamColorAndLogoType;
};
