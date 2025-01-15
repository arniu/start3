import fs from "node:fs/promises";
import { join } from "node:path";

async function assertInProjectRoot() {
  const packageJson = await fs.stat("./package.json");
  if (!packageJson.isFile()) {
    throw new Error("Please run in the Project Root");
  }
}

const RE_SKIP = /\.(md|js|jsx|ts|tsx|mjs|json|css)$/i;
async function moveToPublic(dir) {
  const files = await fs.readdir(dir);
  const filtered = files.filter((it) => !RE_SKIP.test(it));
  for (const name of filtered) {
    const filepath = join(dir, name);
    const stats = await fs.stat(filepath);
    if (stats.isDirectory()) {
      await moveToPublic(filepath);
    } else if (stats.isFile()) {
      const publicDir = dir.replace("src/app/", "public/");
      if (!(await fs.stat(publicDir)).isDirectory()) {
        console.debug("make dir:", publicDir);
        fs.mkdir(publicDir, { recursive: true });
      }

      const filepath2 = join(publicDir, name);
      fs.stat(filepath2).catch(async () => {
        await fs.copyFile(filepath, filepath2);
      });
    }
  }
}

async function main() {
  await assertInProjectRoot();
  await moveToPublic("src/app/examples");
}

main();
