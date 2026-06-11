const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

// During the Android gradle bundle step Metro is loaded with cwd = `android/`.
// nativewind's transitive dep react-native-css-interop calls
// `getConfig(process.cwd())` just to print a userInterfaceStyle warning; with
// cwd at `android/` (no package.json) that call throws and aborts the whole
// config load. Pin cwd to the project root across the withNativeWind call (the
// warning runs synchronously inside it), then restore it.
const originalCwd = process.cwd();
process.chdir(__dirname);
let nativeWindConfig;
try {
  nativeWindConfig = withNativeWind(config, {
    input: path.resolve(__dirname, 'global.css'),
    configPath: path.resolve(__dirname, 'tailwind.config.js'),
  });
} finally {
  process.chdir(originalCwd);
}

module.exports = nativeWindConfig;
