export interface EsportConfig {
  name: string;
  path: string;
  hasApiSupport: boolean;
}

const esportsConfig: EsportConfig[] = [
  { name: "League of Legends", path: "lol", hasApiSupport: true },
  { name: "Valorant", path: "val", hasApiSupport: false },
  { name: "Counter Strike", path: "cs", hasApiSupport: false },
  { name: "Honor of Kings", path: "hon", hasApiSupport: false },
  { name: "PUBG Mobile", path: "pubgmobile", hasApiSupport: false },
  { name: "PUBG", path: "pubg", hasApiSupport: false },
  { name: "Fortnite", path: "fortnite", hasApiSupport: false },
  { name: "Rainbow Six Siege", path: "r6", hasApiSupport: false },
  { name: "Mobile Legends", path: "mlbb", hasApiSupport: false },
  { name: "Call of Duty", path: "cod", hasApiSupport: false },
  { name: "Apex Legends", path: "apex", hasApiSupport: false },
  { name: "Rocket League", path: "rocketleague", hasApiSupport: false },
  { name: "Teamfight Tactics", path: "tft", hasApiSupport: false },
  { name: "CrossFire", path: "cf", hasApiSupport: false },
  { name: "Free Fire", path: "freeFire", hasApiSupport: false },
  { name: "Street Fighter", path: "sf", hasApiSupport: false },
  { name: "EA Sports FC", path: "eafc", hasApiSupport: false },
  { name: "Call of Duty: Warzone", path: "warzone", hasApiSupport: false },
  { name: "Overwatch", path: "ow", hasApiSupport: false },
  { name: "Arena of Valor", path: "aov", hasApiSupport: false },
  { name: "Pokemon", path: "pokemon", hasApiSupport: false },
  { name: "StarCraft II", path: "sc2", hasApiSupport: false },
  { name: "Halo", path: "halo", hasApiSupport: false },
  { name: "Tekken", path: "tekken", hasApiSupport: false },
  { name: "Magic: The Gathering", path: "mtg", hasApiSupport: false },
  { name: "NBA 2K", path: "nba2k", hasApiSupport: false },
  { name: "Clash of Clans", path: "coc", hasApiSupport: false },
  { name: "Madden NFL", path: "madden", hasApiSupport: false },
  { name: "Rennsport", path: "rennsport", hasApiSupport: false },
  { name: "World of Warcraft", path: "wow", hasApiSupport: false },
  { name: "Identity V", path: "idv", hasApiSupport: false },
  { name: "Super Smash Bros", path: "smash", hasApiSupport: false },
  { name: "Hearthstone", path: "hearthstone", hasApiSupport: false },
  { name: "Heroes of the Storm", path: "hots", hasApiSupport: false },
  { name: "Smite", path: "smite", hasApiSupport: false },
  { name: "Brawl Stars", path: "brawlstars", hasApiSupport: false },
  { name: "Clash Royale", path: "clashroyale", hasApiSupport: false },
];

export default esportsConfig;
