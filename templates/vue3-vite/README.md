# vite-vue3

## 相关命令

依赖安装：`pnpm i`

项目启动：`pnpm run dev`

项目构建：`pnpm run build`



## 功能集成

* typescript

* vue-router4：新增`createRouter`API创建路由实例

* pinia：代替vuex的轻量级状态管理库，其去除了mutations，异步方法可由actions支持

* eslint和prettier

* commitlint

* windicss
  
* element-plus

  

## 工程结构

```
vite-vue3

├─ .eslintignore

├─ .eslintrc.js

├─ .gitignore

├─ .husky

│  ├─ commit-msg

│  ├─ pre-commit

│  └─ _

│   ├─ .gitignore

│   └─ husky.sh

├─ commitlint.config.js

├─ index.html

├─ package.json

├─ pnpm-lock.yaml

├─ prettier.config.js

├─ public

│  └─ favicon.ico

├─ README.md

├─ src

│  ├─ App.vue                 主应用

│  ├─ assets                  资源目录

│  │  └─ logo.png

│  ├─ components              组件 

│  │  └─ HelloWorld.vue

│  ├─ env.d.ts                全局声明   

│  ├─ main.ts                 主入口

│  ├─ pages                   页面目录  

│  │  └─ index.vue

│  ├─ router                  路由配置

│  │  └─ index.ts

│  ├─ store                   pinia状态管理

│  │  ├─ index.ts

│  │  └─ user.ts

│  ├─ types                   ts类型定义 

│  │  └─ global 

│  │   └─ request.ts

│  └─ utils                   基础工具包 

│   └─ request.ts

├─ tsconfig.json              ts配置

├─ tsconfig.node.json

├─ vite.config.ts             vite配置

└─ windi.config.ts            windicss配置
```





