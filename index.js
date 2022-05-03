#!/usr/bin/env node
import fs from "fs";
import path from "path";
import prompts from "prompts";
import { red, cyan, green } from "kolorist";
import minimist from "minimist";
import degit from "degit"
import presets from "./presets";

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
  })

  emitter.clone(dist).then(() => {
    console.log(
      `${green("✔ cloned")} ${cyan(userRepo)} to ${cyan(targetDir)}`
    );
  });
}

init().catch((e) => {
  console.error(e);
});
