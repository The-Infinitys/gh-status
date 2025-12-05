import { config, githubStatus } from "./lib";
import { build as buildSvg } from "./lib/svg";

async function main() {
  const cfg = await config();
  const ghs = await githubStatus(cfg);
  console.log(ghs);
  await buildSvg(ghs, cfg);
}
main();
