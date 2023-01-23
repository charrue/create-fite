import fs from "fs";
import path from "path";
import { spawnSync } from "child_process";
import { red } from "kolorist";

export const readPackageJson = (dir) => {
  const packageJsonPath = path.join(dir, "package.json");

  const exists = fs.existsSync(packageJsonPath);

  if (!exists) {
    throw new Error(`package.json not found at: ${packageJsonPath}`);
  }

  const packageJsonString = fs.readFileSync(packageJsonPath, "utf8");

  try {
    return JSON.parse(packageJsonString);
  } catch (error) {
    throw new Error(`Cannot parse package.json: ${error.message}`);
  }
};

export const writePackageJson = (dir, key, value) => {
  try {
    const packageJsonPath = path.join(dir, "package.json");
    const data = readPackageJson(dir);
    data[key] = value;

    fs.writeFileSync(
      packageJsonPath,
      JSON.stringify(data, null, 2),
      {
        encoding: "utf-8",
      },
    );
  } catch (e) {
    if (e.message) {
      console.log(`${red(e.message)}`);
    } else {
      console.error(e);
    }
  }
};

export const gitInit = (dir) => {
  process.chdir(dir);
  const ls = spawnSync("git", ["init"], { encoding: "utf-8" });
  if (!ls || !ls.stdout) {
    console.log(`${red("✖")} git init failed!`);
  } else {
    console.log(ls.stdout);
  }
};
