const registerRouter = require("./backend/router");
// const path = require('path');

// gzip压缩   npm install --save-dev compression-webpack-plugin
const CompressionWebpackPlugin = require("compression-webpack-plugin"); //引入插件
// eslint-disable-next-line no-unused-vars
const productionGZipExtensions = ['js', 'css']; //压缩的文件类型
// gzip压缩js
const compress = new CompressionWebpackPlugin(
  {
    filename: info => {
      return `${info.path}.gz${info.query}`
    },
    algorithm: 'gzip',
    threshold: 10240,
    test: new RegExp(
        '\\.(' +
        ['js'].join('|') +
        ')$'
    ),
    minRatio: 0.8,
    deleteOriginalAssets: false
  }
)
module.exports = {
  css: {
    // 因为js会动态的加载出css，所以js文件包会比较大，那么需要提取css代码到文件，
    // 这里只需要将css配置extract: true
    extract: true,
    loaderOptions: {
      sass: {
        // 全局引入变量合mixin
        additionalData: `
        @import "@/assets/scss/variable.scss";
        @import "@/assets/scss/mixin.scss";
        `,
      },
    },
  },
  devServer: {
    before(app) {
      registerRouter(app);
    },
  },
  configureWebpack: (config) => {
    if (process.env.NODE_ENV === "production") {
      config.plugins.push(compress);
    }
    if (process.env.npm_config_report) {
      const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
        .BundleAnalyzerPlugin;
      config.plugins.push(new BundleAnalyzerPlugin());
    }
    // console.log('configurewebpack---config---', config)
  },
  chainWebpack: (config) => {
    config.optimization.minimize(true); // 压缩代码

    config.optimization.splitChunks({
      // 分割代码
      chunks: "all",
    });

    config.externals({
      // 用cdn方式引入外部资源
      vue: "Vue",
      vuex: "Vuex",
      "vue-router": "VueRouter",
      axios: "axios",
    });
  },
  productionSourceMap: false,
  publicPath: process.env.NODE_ENV === "production" ? "/" : "/",
};
