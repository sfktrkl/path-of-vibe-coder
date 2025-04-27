const { defineConfig } = require("@vue/cli-service");
const webpack = require("webpack");
const path = require("path");

module.exports = defineConfig({
  transpileDependencies: true,
  pages: {
    index: {
      entry: "src/main.js",
      title: "Path of Vibe Coder",
    },
  },
  configureWebpack: {
    plugins: [
      new webpack.DefinePlugin({
        __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: "false",
        __VUE_PROD_DEVTOOLS__: false,
        __VUE_OPTIONS_API__: true,
      }),
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
        "@styles": path.resolve(__dirname, "src/assets/styles"),
        "@components": path.resolve(
          __dirname,
          "src/components/game/components"
        ),
        "@items": path.resolve(__dirname, "src/components/game/items"),
        "@views": path.resolve(__dirname, "src/components/game/views"),
        "@layout": path.resolve(__dirname, "src/components/layout"),
        "@data": path.resolve(__dirname, "src/data"),
        "@mixins": path.resolve(__dirname, "src/mixins"),
        "@models": path.resolve(__dirname, "src/models"),
        "@utils": path.resolve(__dirname, "src/utils"),
      },
    },
  },
});
