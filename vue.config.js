// eslint-disable-next-line @typescript-eslint/no-var-requires
const PrerenderSPAPlugin = require('prerender-spa-plugin');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');

module.exports = {
  pluginOptions: {
    webpackBundleAnalyzer: {
      openAnalyzer: false,
    },
  },
  chainWebpack: (config) => {
    if (process.env.NODE_ENV === 'development') {
      config
        .output
        .filename('[name].[hash].js')
        .end();
    }

    config.module
      .rule('images')
      .use('url-loader')
      .loader('url-loader')
      .tap((options) => ({
        ...options,
        limit: 30000,
      }));

    if (config.plugins.has('copy')) {
      config
        .plugin('copy')
        .tap((options) => {
          if (options[0]) {
            options[0].push({
              from: path.join(config.get('context'), 'src/graphics'),
              to: path.join(config.output.get('path'), 'graphics'),
              toType: 'dir',
            });
          }
          return options;
        });
    }
  },
  // eslint-disable-next-line consistent-return
  configureWebpack: (config) => {
    if (process.env.NODE_ENV === 'production') {
      return {
        plugins: [
          new PrerenderSPAPlugin({
            // Required - The path to the webpack-outputted app to prerender.
            staticDir: config.output.path,
            // Required - Routes to render.
            routes: [
              '/',
              ...require('./src/data.json')
                .map((item) => `/gallery/${item.filename}`)
            ],
          }),
        ],
      };
    }
  },
  css: {
    loaderOptions: {
      scss: {
        prependData: '@import "~@/assets/scss/variables";',
      },
    },
  },
};
