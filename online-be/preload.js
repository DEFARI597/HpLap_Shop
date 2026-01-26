const crypto = require('crypto');
globalThis.crypto = crypto;
if (!globalThis.crypto.randomUUID) {
  globalThis.crypto.randomUUID = function() {
    return crypto.randomBytes(16).toString('hex');
  };
}
console.log('✅ Crypto polyfill loaded');
