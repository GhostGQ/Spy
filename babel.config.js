module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ['babel-preset-expo', { jsxImportSource: 'nativewind' }],
      'nativewind/babel',
    ],
    plugins: [
      // Rewrite `import.meta` (used by some deps like zustand) into a safe object
      // so the bundle parses on web (classic script) and Hermes.
      './import-meta-plugin.js',
      // react-native-worklets/plugin must be listed last (replaces reanimated/plugin in Reanimated 4)
      'react-native-worklets/plugin',
    ],
  };
};
