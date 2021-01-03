const ExtractTextPlugin = require("mini-css-extract-plugin");
const path = require("path");

module.exports = {
  devServer: {
    port: "8080",
  },
  runtimeCompiler: true,
  chainWebpack: (config) => {
    config.resolve.alias.set(
        'vue$',
        // If using the runtime only build
        path.resolve(__dirname, 'node_modules/vue/dist/vue.runtime.esm.js')
        // Or if using full build of Vue (runtime + compiler)
        // path.resolve(__dirname, 'node_modules/vue/dist/vue.esm.js')
    )

    config.optimization.delete("splitChunks");

    config.output.filename("[name].js");

    config.plugin("extract-css").use(ExtractTextPlugin, [
      {
        filename: "[name].css",
        allChunks: true,
      },
    ]);
  },
  configureWebpack: {
    output: {
      filename: "[name].js",
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
      extensions: [".js", ".vue", ".json"],
    },
  },
  lintOnSave: true,
  css: {
    loaderOptions: {
      sass: {
        prependData: `
          @import "@/scss/style.scss";
        `,
      },
    },
  },
};
