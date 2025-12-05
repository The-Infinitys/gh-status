import { config } from "./lib";

async function main() {
  const cfg = await config();
  console.log(cfg);
}
main();
