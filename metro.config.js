// // metro.config.js
// const { wrapWithReanimatedMetroConfig } = require('react-native-reanimated/metro-config');

// const config = {
//   // Optional: Bạn có thể thêm các cấu hình tùy chỉnh ở đây
// };

// module.exports = wrapWithReanimatedMetroConfig(config);
const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = {};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
