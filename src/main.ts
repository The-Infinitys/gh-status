import { config, githubStatus } from "./lib";

async function main() {
  const cfg = await config();
  const ghs = await githubStatus(cfg);
  console.log(ghs);
}
main();
