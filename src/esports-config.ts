export interface EsportConfig {
  name: string;
  path: string;
  hasApiSupport: boolean;
}

const esportsConfig: EsportConfig[] = [
  {
    name: "League of Legends",
    path: "lol",
    hasApiSupport: true,
  },
  {
    name: "Valorant",
    path: "val",
    hasApiSupport: false,
  },
  {
    name: "Counter Strike",
    path: "cs",
    hasApiSupport: false,
  },
];

export default esportsConfig;
