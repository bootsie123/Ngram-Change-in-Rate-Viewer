const info = require("./package.json");

process.env.VUE_APP_VERSION = info.version;

module.exports = {
  devServer: {
    proxy: "http://localhost:" + (process.env.SERVER_PORT || 3000)
  },
  outputDir: "./dist/web",
  pages: {
    index: {
      entry: "./src/main.js",
      title: "Ngram Viewer"
    }
  },
  css: {
    loaderOptions: {
      scss: {
        prependData: "@import '@/assets/main.scss';"
      }
    }
  }
};
