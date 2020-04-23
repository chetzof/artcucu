/*
eslint-disable @typescript-eslint/no-var-requires, global-require
 */
const PrerenderSPAPlugin = require('prerender-spa-plugin');

module.exports = {
  pluginOptions: {
    webpackBundleAnalyzer: {
      openAnalyzer: false,
    },
  },
  chainWebpack: (config) => {
    config.plugins.delete('prefetch');
    if (process.env.NODE_ENV === 'development') {
      config.output.filename('[name].[hash].js').end();
    }

    if (process.env.NODE_ENV === 'production') {
      config
        .plugin('prerender')
        .use(PrerenderSPAPlugin, [
          {
            // Required - The path to the webpack-outputted app to prerender.
            staticDir: config.output.get('path'),
            // Required - Routes to render.
            routes: ['/', ...require('./src/data.json').map((item) => `/gallery/${item.filename}`)],
          },
        ])
        .before('vue-loader');
      config.module
        .rule('svgo')
        .test(/\.(svg)(\?.*)?$/)
        .use('svgo')
        .loader('svgo-loader')
        .options({
          plugins: [
            {
              removeUnknownsAndDefaults: {
                keepDataAttrs: false,
              },
            },
          ],
        });
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
