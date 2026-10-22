// Only needed for the web target: expo-sqlite on web runs SQLite as WebAssembly,
// which needs .wasm assets and cross-origin isolation (SharedArrayBuffer).
// Native builds and Expo Go ignore this.
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.resolver.assetExts.push('wasm');
config.server.enhanceMiddleware = (middleware) => (req, res, next) => {
  res.setHeader('Cross-Origin-Embedder-Policy', 'credentialless');
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
  middleware(req, res, next);
};

module.exports = config;
