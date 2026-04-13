module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ['babel-preset-expo', { jsxImportSource: 'nativewind' }],
      // NativeWind v4: must be in `presets`, not `plugins`.
      'nativewind/babel'
    ],
    plugins: [
      // Must be listed last for react-native-reanimated.
      'react-native-reanimated/plugin'
    ]
  };
};

