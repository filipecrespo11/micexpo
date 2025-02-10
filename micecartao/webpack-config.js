const createExpoWebpackConfigAsync = require('@expo/webpack-config');

module.exports = async function(env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);
  // Customize the config before returning it.
  config.resolve.alias['react-native-signature-canvas'] = 'react-native-signature-canvas/dist/index.web.js';
  return config;
};