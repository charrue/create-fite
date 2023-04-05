import fs from "fs";
import path from "path";
import { red, cyan, green } from "kolorist";
import minimist from "minimist";
import degit from "degit";
import presets from "./presets";
import { writePackageJson, gitInit } from "./utils";
import * as p from "@clack/prompts";

interface CreateFiteConfig {
  projectName: string;
  preset: string;
}

const createPrompts = async (initialValue: Partial<CreateFiteConfig> = {}) => {
  const result = await p.group(
    {
      projectName: () => p.text({
        message: "Please input your project name",
        placeholder: "my-project",
        initialValue: initialValue.projectName || "",
      }),
      preset: () => p.select({
        message: "Please select a template",
        options: presets,
        initialValue: initialValue.preset || "",
      }),
    },
    {
      onCancel: () => {
        throw new Error(`${red("✖")} Operation cancelled`);
      },
    },
  );

  return result;
};

const ensureDist = (config: CreateFiteConfig) => {
  const cwd = process.cwd();
  let projectName = config.projectName.trim();
  let dist = path.join(cwd, projectName);

  if (fs.existsSync(dist)) {
    projectName = `${projectName}-new`;
    dist = path.join(cwd, projectName);
  }

  return {
    ...config,
    projectName,
    dist,
  };
};

const cloneProject = async (config: CreateFiteConfig) => {
  const { projectName, preset: userRepo, dist } = ensureDist(config);
  const emitter = degit(userRepo, {
    cache: false,
    force: true,
    verbose: true,
  });

  try {
    const s = p.spinner();
    s.start("Cloning...");
    await emitter.clone(dist);
    s.stop();
    console.log(`${green("✔ cloned")} ${cyan(userRepo)} to ${cyan(projectName)}`);

    writePackageJson(dist, "name", projectName);

    gitInit(dist);

    const nextSteps = `cd ${projectName}        \npnpm install`;
    p.note(nextSteps, "Next steps");
  } catch (e) {
    console.error(e);
  }
};

async function init() {
  const argv = minimist(process.argv.slice(2), {});
  let result: CreateFiteConfig = {
    projectName: argv._[0] || "my-project",
    preset: "",
  };

  try {
    result = await createPrompts(result);
  } catch (cancelled: any) {
    console.error(cancelled.message || "some error!");
    process.exit(1);
  }

  await cloneProject(result);
}

init().catch((e) => {
  console.error(e);
});
