const path = require("path");
const { cdnExternals, cdnConfig } = require("./cdn.config");

const name = "Demo";
const external = { ...cdnExternals };

function resolve(dir) {
  return path.join(__dirname, dir);
}

module.exports = {
  pluginOptions: {
    windicss: {
      // see https://github.com/windicss/vite-plugin-windicss/blob/main/packages/plugin-utils/src/options.ts
    },
  },
  publicPath: "./",
  css: {
    loaderOptions: {
      scss: {
        prependData: ` @import "@/styles/variable.scss";`,
      },
    },
  },
  productionSourceMap: false,
  configureWebpack: (config) => {
    config.name = name;

    if (process.env.NODE_ENV !== "development") {
      config.externals = external;
    }
  },

  chainWebpack(config) {
    config
      .when(process.env.NODE_ENV !== "development",
        // eslint-disable-next-line no-shadow
        (config) => {
          config
            .plugin("ScriptExtHtmlWebpackPlugin")
            .after("html")
            .use("script-ext-html-webpack-plugin", [{
              // `runtime` must same as runtimeChunk name. default is `runtime`
              inline: /runtime\..*\.js$/,
            }])
            .end();
          config
            .optimization.splitChunks({
              chunks: "all",
              cacheGroups: {
                commons: {
                  name: "chunk-commons",
                  test: resolve("src/components"), // can customize your rules
                  minChunks: 3, //  minimum common number
                  priority: 5,
                  reuseExistingChunk: true,
                },
              },
            });

          // https:// webpack.js.org/configuration/optimization/#optimizationruntimechunk
          config.optimization.runtimeChunk("single");
        });

    config.plugin("html")
      .tap((args) => {
        args[0].cdn = process.env.NODE_ENV !== "development" ? cdnConfig : [];
        args[0].env = process.env.NODE_ENV;
        args[0].title = name;
        return args;
      });
  },
};
