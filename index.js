#!/usr/bin/env node
import fs from "fs";
import path from "path";
import prompts from "prompts";
import { red } from "kolorist";
import minimist from "minimist";

import presets from "./presets";
import renderTemplate from "./helper/renderTemplate.js";

const render = ({
  root,
  projectName,
  templateName,
}) => {
  const templateRoot = path.resolve(__dirname, "templates");

  const templateDir = path.resolve(templateRoot, templateName);
  renderTemplate(templateDir, root);

  const templateDirPkg = path.resolve(templateDir, "package.json");
  const templateDirPkgContent = fs.readFileSync(templateDirPkg, "utf-8");
  const pkgContent = JSON.parse(templateDirPkgContent);
  pkgContent.name = projectName;
  fs.writeFileSync(templateDirPkg, JSON.stringify(pkgContent, null, 2));
};

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

  const { projectName, preset } = result;

  const root = path.join(cwd, targetDir);

  if (!fs.existsSync(root)) {
    fs.mkdirSync(root);
  }

  render({
    projectName,
    templateName: preset,
    root,
  });
}

init().catch((e) => {
  console.error(e);
});
