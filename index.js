#!/usr/bin/env node
import fs from "fs";
import path from "path";
import prompts from "prompts";
import { red, cyan, green } from "kolorist";
import minimist from "minimist";
import degit from "degit"
import presets from "./presets";
import { spawnSync } from "child_process"

async function init() {
  const cwd = process.cwd();

  const argv = minimist(process.argv.slice(2), {});

  let targetDir = argv._[0];
  const defaultProjectName = !targetDir ? "my-project" : targetDir;

  let result = {};

  try {
    result = await prompts([
      {
        name: "projectName",
        type: targetDir ? null : "text",
        message: "Please input your project name",
        initial: defaultProjectName,
        onState: (state) => {
          targetDir = String(state.value).trim() || defaultProjectName;
        },
      },
      {
        name: "preset",
        type: "select",
        message: "Please select a template",
        choices: presets,
      },
    ], {
      onCancel: () => {
        throw new Error(`${red("✖")} Operation cancelled`);
      },
    });
  } catch (cancelled) {
    console.log(cancelled.message);
    process.exit(1);
  }

  const userRepo = result.preset

  let dist = path.join(cwd, targetDir);

  if (fs.existsSync(dist)) {
    targetDir = `${targetDir}-1`;
    dist = path.join(cwd, targetDir);
  }
  const emitter = degit(userRepo, {
    cache: false,
    force: true,
    verbose: true,
  });

  try {
    await emitter.clone(dist);
    console.log(`${green("✔ cloned")} ${cyan(userRepo)} to ${cyan(targetDir)}`);

    const ls = spawnSync("git", ["init"], { encoding: "utf-8" });
    if (!ls || ls.stdout) {
      console.log(`${red("✖")} git init failed!`);
    } else {
      console.log(ls.stdout);
    }

    writePackageJson(dist, "name", targetDir);
  } catch (e) {
    console.error(e);
  }
}

const readPackageJson = (dir) => {
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
}

const writePackageJson = (dir, key, value) => {
  try {
    const packageJsonPath = path.join(dir, "package.json");
    const data = readPackageJson(dir);
    data[key] = value;

    fs.writeFileSync(
      packageJsonPath,
      JSON.stringify(data, null, 2),
      {
        encoding: "utf-8"
      }
    );
  } catch (e) {
    if (e.message) {
      console.log(`${red(e.message)}`);
    } else {
      console.error(e)
    }
  }
}

init().catch((e) => {
  console.error(e);
});
