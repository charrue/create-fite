const fs = require("fs");
const path = require("path");
const { prompt } = require("enquirer");
const {
  getXwmlTemplate,
  getLessTemplate,
  getJsonTemplate,
  getPageJsTemplate,
} = require("./template");
const { logger } = require("../libs/logger");
const appJSON = require("../app.json");

const templateMap = {
  wxml: getXwmlTemplate,
  less: getLessTemplate,
  json: getJsonTemplate,
  js: getPageJsTemplate,
};

const createTemplate = ({
  filename: pageDir, name, title, parent,
}) => {
  // 检查父级文件夹是否存在
  const parentPageDir = path.resolve(__dirname, `../pages/${parent}`);
  if (!fs.existsSync(parentPageDir)) {
    fs.mkdirSync(parentPageDir);
  }

  // 检查二级页面的文件夹是否存在
  const dirPath = path.resolve(__dirname, pageDir);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath);
  }

  // 生成必要的文件
  Object.keys(templateMap).forEach((t) => {
    const content = templateMap[t](name, title);
    fs.writeFileSync(
      path.resolve(__dirname, pageDir, `${name}.${t}`),
      content.trim(),
      {
        encoding: "utf-8",
      },
    );
  });
};

class CreatePageFactory {
  start() {
    prompt({
      type: "confirm",
      name: "createTabbar",
      message: "是否是tabbar页面?",
    })
      .then(async ({ createTabbar }) => {
        await this.createPageFilesAndConfig(createTabbar);
        this.updateAppJSON();
      })
      .catch((e) => {
        console.log("[error]", e);
      });
  }

  async ask(isTabbar) {
    if (!isTabbar) {
      const promptResult = await prompt({
        type: "input",
        name: "parent",
        message: "所属的一级页面的名称为(en)？",
      });
      this.parent = promptResult.parent;
      // 不存在该一级页面
      if (!appJSON.pages.includes(`pages/tabbar/${this.parent}/${this.parent}`)) {
        return;
      }
    }
    const { name } = await prompt({
      type: "input",
      name: "name",
      message: "创建的页面的名称为(en)？",
    });
    const { title } = await prompt({
      type: "input",
      name: "title",
      message: "创建的页面的标题为(Zh-ch)？",
    });
    this.name = name;
    this.title = title;
  }

  async createPageFilesAndConfig(isTabbar) {
    await this.ask(isTabbar);

    this.existsPageSync(this.name, this.parent);

    logger.info("正在创建文件...");

    try {
      createTemplate({
        filename: this.filename,
        name: this.name,
        title: this.title,
        parent: this.parent,
      });
      logger.success("模板文件创建成功！");
    } catch (error) {
      logger.error("模板文件创建失败！");
      console.log(error);
    }
  }

  existsPageSync(name, parentName) {
    const pageRoute = `pages/${parentName || "tabbar"}/${name}/${name}`;
    const filename = path.resolve(__dirname, `../pages/${parentName || "tabbar"}/${name}`);

    if (fs.existsSync(filename)) {
      logger.error(`${filename} 已存在！`);
      return;
    }
    if (appJSON.pages.includes(pageRoute)) {
      logger.error(`${pageRoute} 路由已存在!`);
      return;
    }
    this.filename = filename;
    this.pageRoute = pageRoute;
  }

  updateAppJSON() {
    if (!this.pageRoute) return;

    logger.info("正在更新app.json...");
    // eslint-disable-next-line global-require
    const prevData = require("../app.json");
    const currentData = {
      ...prevData,
    };
    currentData.pages.push(this.pageRoute);

    currentData.pages
      .sort((a, b) => {
        if (a.startsWith("pages/tabbar") && !b.startsWith("pages/tabbar")) return -1;
        if (!a.startsWith("pages/tabbar") && b.startsWith("pages/tabbar")) return 1;
        return a > b;
      })
      .filter((t) => t);
    try {
      fs.writeFileSync(
        path.resolve(__dirname, "../app.json"),
        JSON.stringify(currentData, null, 2),
        {
          encoding: "utf8",
        },
      );
      logger.success("app.json更新成功!");
    } catch (error) {
      logger.error("app.json更新失败!");
      console.log(error);
    }
  }
}

new CreatePageFactory().start();
