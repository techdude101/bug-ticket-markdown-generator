/* eslint-disable no-param-reassign */
// vue.config.js
module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? '/edit-template-page/' : '/',
  configureWebpack: (config) => {
    config.output.filename = '[name].js';
  },
};
