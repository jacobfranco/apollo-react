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
    path: "valorant",
    hasApiSupport: false,
  },
];

export default esportsConfig;