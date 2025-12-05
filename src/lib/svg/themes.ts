export interface Theme {
  titleColor: string;
  iconColor: string;
  textColor: string;
  bgColor: string;
  borderColor?: string;
}

// themes はテーマ名をキーとし、値として Theme オブジェクトを持つオブジェクトとして定義します。
export const themes: { [key: string]: Theme } = {
  default: {
    titleColor: "2f80ed",
    iconColor: "4c71f2",
    textColor: "434d58",
    bgColor: "fffefe",
    borderColor: "e4e2e2",
  },
  default_repocard: {
    titleColor: "2f80ed",
    iconColor: "586069", // icon color is different
    textColor: "434d58",
    bgColor: "fffefe",
    // borderColor:  undefined (データになし)
  },
  transparent: {
    titleColor: "006AFF",
    iconColor: "0579C3",
    textColor: "417E87",
    bgColor: "ffffff00",
    // borderColor:  undefined (データになし)
  },
  shadow_red: {
    titleColor: "9A0000",
    textColor: "444",
    iconColor: "4F0000",
    borderColor: "4F0000",
    bgColor: "ffffff00",
  },
  shadow_green: {
    titleColor: "007A00",
    textColor: "444",
    iconColor: "003D00",
    borderColor: "003D00",
    bgColor: "ffffff00",
  },
  shadow_blue: {
    titleColor: "00779A",
    textColor: "444",
    iconColor: "004450",
    borderColor: "004490",
    bgColor: "ffffff00",
  },
  dark: {
    titleColor: "fff",
    iconColor: "79ff97",
    textColor: "9f9f9f",
    bgColor: "151515",
    // borderColor:  undefined (データになし)
  },
  radical: {
    titleColor: "fe428e",
    iconColor: "f8d847",
    textColor: "a9fef7",
    bgColor: "141321",
    // borderColor:  undefined (データになし)
  },
  merko: {
    titleColor: "abd200",
    iconColor: "b7d364",
    textColor: "68b587",
    bgColor: "0a0f0b",
    // borderColor:  undefined (データになし)
  },
  gruvbox: {
    titleColor: "fabd2f",
    iconColor: "fe8019",
    textColor: "8ec07c",
    bgColor: "282828",
    // borderColor:  undefined (データになし)
  },
  gruvbox_light: {
    titleColor: "b57614",
    iconColor: "af3a03",
    textColor: "427b58",
    bgColor: "fbf1c7",
    // borderColor:  undefined (データになし)
  },
  tokyonight: {
    titleColor: "70a5fd",
    iconColor: "bf91f3",
    textColor: "38bdae",
    bgColor: "1a1b27",
    // borderColor:  undefined (データになし)
  },
  onedark: {
    titleColor: "e4bf7a",
    iconColor: "8eb573",
    textColor: "df6d74",
    bgColor: "282c34",
    // borderColor:  undefined (データになし)
  },
  cobalt: {
    titleColor: "e683d9",
    iconColor: "0480ef",
    textColor: "75eeb2",
    bgColor: "193549",
    // borderColor:  undefined (データになし)
  },
  synthwave: {
    titleColor: "e2e9ec",
    iconColor: "ef8539",
    textColor: "e5289e",
    bgColor: "2b213a",
    // borderColor:  undefined (データになし)
  },
  highcontrast: {
    titleColor: "e7f216",
    iconColor: "00ffff",
    textColor: "fff",
    bgColor: "000",
    // borderColor:  undefined (データになし)
  },
  dracula: {
    titleColor: "ff6e96",
    iconColor: "79dafa",
    textColor: "f8f8f2",
    bgColor: "282a36",
    // borderColor:  undefined (データになし)
  },
  prussian: {
    titleColor: "bddfff",
    iconColor: "38a0ff",
    textColor: "6e93b5",
    bgColor: "172f45",
    // borderColor:  undefined (データになし)
  },
  monokai: {
    titleColor: "eb1f6a",
    iconColor: "e28905",
    textColor: "f1f1eb",
    bgColor: "272822",
    // borderColor:  undefined (データになし)
  },
  vue: {
    titleColor: "41b883",
    iconColor: "41b883",
    textColor: "273849",
    bgColor: "fffefe",
    // borderColor:  undefined (データになし)
  },
  "vue-dark": {
    // キーの引用符を修正
    titleColor: "41b883",
    iconColor: "41b883",
    textColor: "fffefe",
    bgColor: "273849",
    // borderColor:  undefined (データになし)
  },
  "shades-of-purple": {
    // キーの引用符を修正
    titleColor: "fad000",
    iconColor: "b362ff",
    textColor: "a599e9",
    bgColor: "2d2b55",
    // borderColor:  undefined (データになし)
  },
  nightowl: {
    titleColor: "c792ea",
    iconColor: "ffeb95",
    textColor: "7fdbca",
    bgColor: "011627",
    // borderColor:  undefined (データになし)
  },
  buefy: {
    titleColor: "7957d5",
    iconColor: "ff3860",
    textColor: "363636",
    bgColor: "ffffff",
    // borderColor:  undefined (データになし)
  },
  "blue-green": {
    // キーの引用符を修正
    titleColor: "2f97c1",
    iconColor: "f5b700",
    textColor: "0cf574",
    bgColor: "040f0f",
    // borderColor:  undefined (データになし)
  },
  algolia: {
    titleColor: "00AEFF",
    iconColor: "2DDE98",
    textColor: "FFFFFF",
    bgColor: "050F2C",
    // borderColor:  undefined (データになし)
  },
  "great-gatsby": {
    // キーの引用符を修正
    titleColor: "ffa726",
    iconColor: "ffb74d",
    textColor: "ffd95b",
    bgColor: "000000",
    // borderColor:  undefined (データになし)
  },
  darcula: {
    titleColor: "BA5F17",
    iconColor: "84628F",
    textColor: "BEBEBE",
    bgColor: "242424",
    // borderColor:  undefined (データになし)
  },
  bear: {
    titleColor: "e03c8a",
    iconColor: "00AEFF",
    textColor: "bcb28d",
    bgColor: "1f2023",
    // borderColor:  undefined (データになし)
  },
  "solarized-dark": {
    // キーの引用符を修正
    titleColor: "268bd2",
    iconColor: "b58900",
    textColor: "859900",
    bgColor: "002b36",
    // borderColor:  undefined (データになし)
  },
  "solarized-light": {
    // キーの引用符を修正
    titleColor: "268bd2",
    iconColor: "b58900",
    textColor: "859900",
    bgColor: "fdf6e3",
    // borderColor:  undefined (データになし)
  },
  "chartreuse-dark": {
    // キーの引用符を修正
    titleColor: "7fff00",
    iconColor: "00AEFF",
    textColor: "fff",
    bgColor: "000",
    // borderColor:  undefined (データになし)
  },
  nord: {
    titleColor: "81a1c1",
    textColor: "d8dee9",
    iconColor: "88c0d0",
    bgColor: "2e3440",
    // borderColor:  undefined (データになし)
  },
  gotham: {
    titleColor: "2aa889",
    iconColor: "599cab",
    textColor: "99d1ce",
    bgColor: "0c1014",
    // borderColor:  undefined (データになし)
  },
  "material-palenight": {
    // キーの引用符を修正
    titleColor: "c792ea",
    iconColor: "89ddff",
    textColor: "a6accd",
    bgColor: "292d3e",
    // borderColor:  undefined (データになし)
  },
  graywhite: {
    titleColor: "24292e",
    iconColor: "24292e",
    textColor: "24292e",
    bgColor: "ffffff",
    // borderColor:  undefined (データになし)
  },
  "vision-friendly-dark": {
    // キーの引用符を修正
    titleColor: "ffb000",
    iconColor: "785ef0",
    textColor: "ffffff",
    bgColor: "000000",
    // borderColor:  undefined (データになし)
  },
  "ayu-mirage": {
    // キーの引用符を修正
    titleColor: "f4cd7c",
    iconColor: "73d0ff",
    textColor: "c7c8c2",
    bgColor: "1f2430",
    // borderColor:  undefined (データになし)
  },
  "midnight-purple": {
    // キーの引用符を修正
    titleColor: "9745f5",
    iconColor: "9f4bff",
    textColor: "ffffff",
    bgColor: "000000",
    // borderColor:  undefined (データになし)
  },
  calm: {
    titleColor: "e07a5f",
    iconColor: "edae49",
    textColor: "ebcfb2",
    bgColor: "373f51",
    // borderColor:  undefined (データになし)
  },
  "flag-india": {
    // キーの引用符を修正
    titleColor: "ff8f1c",
    iconColor: "250E62",
    textColor: "509E2F",
    bgColor: "ffffff",
    // borderColor:  undefined (データになし)
  },
  omni: {
    titleColor: "FF79C6",
    iconColor: "e7de79",
    textColor: "E1E1E6",
    bgColor: "191622",
    // borderColor:  undefined (データになし)
  },
  react: {
    titleColor: "61dafb",
    iconColor: "61dafb",
    textColor: "ffffff",
    bgColor: "20232a",
    // borderColor:  undefined (データになし)
  },
  jolly: {
    titleColor: "ff64da",
    iconColor: "a960ff",
    textColor: "ffffff",
    bgColor: "291B3E",
    // borderColor:  undefined (データになし)
  },
  maroongold: {
    titleColor: "F7EF8A",
    iconColor: "F7EF8A",
    textColor: "E0AA3E",
    bgColor: "260000",
    // borderColor:  undefined (データになし)
  },
  yeblu: {
    titleColor: "ffff00",
    iconColor: "ffff00",
    textColor: "ffffff",
    bgColor: "002046",
    // borderColor:  undefined (データになし)
  },
  blueberry: {
    titleColor: "82aaff",
    iconColor: "89ddff",
    textColor: "27e8a7",
    bgColor: "242938",
    // borderColor:  undefined (データになし)
  },
  slateorange: {
    titleColor: "faa627",
    iconColor: "faa627",
    textColor: "ffffff",
    bgColor: "36393f",
    // borderColor:  undefined (データになし)
  },
  kacho_ga: {
    titleColor: "bf4a3f",
    iconColor: "a64833",
    textColor: "d9c8a9",
    bgColor: "402b23",
    // borderColor:  undefined (データになし)
  },
  outrun: {
    titleColor: "ffcc00",
    iconColor: "ff1aff",
    textColor: "8080ff",
    bgColor: "141439",
    // borderColor:  undefined (データになし)
  },
  ocean_dark: {
    titleColor: "8957B2",
    iconColor: "FFFFFF",
    textColor: "92D534",
    bgColor: "151A28",
    // borderColor:  undefined (データになし)
  },
  city_lights: {
    titleColor: "5D8CB3",
    iconColor: "4798FF",
    textColor: "718CA1",
    bgColor: "1D252C",
    // borderColor:  undefined (データになし)
  },
  github_dark: {
    titleColor: "58A6FF",
    iconColor: "1F6FEB",
    textColor: "C3D1D9",
    bgColor: "0D1117",
    // borderColor:  undefined (データになし)
  },
  github_dark_dimmed: {
    titleColor: "539bf5",
    iconColor: "539bf5",
    textColor: "ADBAC7",
    bgColor: "24292F",
    borderColor: "373E47",
  },
  discord_old_blurple: {
    // キーの引用符を修正
    titleColor: "7289DA",
    iconColor: "7289DA",
    textColor: "FFFFFF",
    bgColor: "2C2F33",
    // borderColor:  undefined (データになし)
  },
  aura_dark: {
    titleColor: "ff7372",
    iconColor: "6cffd0",
    textColor: "dbdbdb",
    bgColor: "252334",
    // borderColor:  undefined (データになし)
  },
  panda: {
    titleColor: "19f9d899",
    iconColor: "19f9d899",
    textColor: "FF75B5",
    bgColor: "31353a",
    // borderColor:  undefined (データになし)
  },
  noctis_minimus: {
    titleColor: "d3b692",
    iconColor: "72b7c0",
    textColor: "c5cdd3",
    bgColor: "1b2932",
    // borderColor:  undefined (データになし)
  },
  cobalt2: {
    titleColor: "ffc600",
    iconColor: "ffffff",
    textColor: "0088ff",
    bgColor: "193549",
    // borderColor:  undefined (データになし)
  },
  swift: {
    titleColor: "000000",
    iconColor: "f05237",
    textColor: "000000",
    bgColor: "f7f7f7",
    // borderColor:  undefined (データになし)
  },
  aura: {
    titleColor: "a277ff",
    iconColor: "ffca85",
    textColor: "61ffca",
    bgColor: "15141b",
    // borderColor:  undefined (データになし)
  },
  apprentice: {
    titleColor: "ffffff",
    iconColor: "ffffaf",
    textColor: "bcbcbc",
    bgColor: "262626",
    // borderColor:  undefined (データになし)
  },
  moltack: {
    titleColor: "86092C",
    iconColor: "86092C",
    textColor: "574038",
    bgColor: "F5E1C0",
    // borderColor:  undefined (データになし)
  },
  codeSTACKr: {
    titleColor: "ff652f",
    iconColor: "FFE400",
    textColor: "ffffff",
    bgColor: "09131B",
    borderColor: "0c1a25",
  },
  rose_pine: {
    titleColor: "9ccfd8",
    iconColor: "ebbcba",
    textColor: "e0def4",
    bgColor: "191724",
    // borderColor:  undefined (データになし)
  },
  catppuccin_latte: {
    titleColor: "137980",
    iconColor: "8839ef",
    textColor: "4c4f69",
    bgColor: "eff1f5",
    // borderColor:  undefined (データになし)
  },
  catppuccin_mocha: {
    titleColor: "94e2d5",
    iconColor: "cba6f7",
    textColor: "cdd6f4",
    bgColor: "1e1e2e",
    // borderColor:  undefined (データになし)
  },
  date_night: {
    titleColor: "DA7885",
    textColor: "E1B2A2",
    iconColor: "BB8470",
    borderColor: "170F0C",
    bgColor: "170F0C",
  },
  one_dark_pro: {
    titleColor: "61AFEF",
    textColor: "E5C06E",
    iconColor: "C678DD",
    borderColor: "3B4048",
    bgColor: "23272E",
  },
  rose: {
    titleColor: "8d192b",
    textColor: "862931",
    iconColor: "B71F36",
    borderColor: "e9d8d4",
    bgColor: "e9d8d4",
  },
  holi: {
    titleColor: "5FABEE",
    textColor: "D6E7FF",
    iconColor: "5FABEE",
    borderColor: "85A4C0",
    bgColor: "030314",
  },
  neon: {
    titleColor: "00EAD3",
    textColor: "FF449F",
    iconColor: "00EAD3",
    borderColor: "ffffff",
    bgColor: "000000",
  },
  blue_navy: {
    titleColor: "82AAFF",
    textColor: "82AAFF",
    iconColor: "82AAFF",
    borderColor: "ffffff",
    bgColor: "000000",
  },
  calm_pink: {
    titleColor: "e07a5f",
    textColor: "edae49",
    iconColor: "ebcfb2",
    borderColor: "e1bc29",
    bgColor: "2b2d40",
  },
  ambient_gradient: {
    titleColor: "ffffff",
    textColor: "ffffff",
    iconColor: "ffffff",
    bgColor: "35,4158d0,c850c0,ffcc70", // この値はグラデーション指定としてそのまま残します
    // borderColor:  undefined (データになし)
  },
};

export default themes;
