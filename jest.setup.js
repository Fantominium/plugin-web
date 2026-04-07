// jest.setup.js
// Configure jest-dom for additional matchers
import '@testing-library/jest-dom';

// Polyfill TextEncoder/TextDecoder for jest-environment-jsdom, which does not
// expose these globals in all versions. Tests that exercise Web Crypto (crypto.subtle)
// should declare /** @jest-environment node */ to use the native Node.js environment.
import { TextDecoder, TextEncoder } from 'node:util';

if (typeof globalThis.TextEncoder === 'undefined') {
  // @ts-expect-error Node TextEncoder is compatible with the DOM type
  globalThis.TextEncoder = TextEncoder;
}
if (typeof globalThis.TextDecoder === 'undefined') {
  // @ts-expect-error Node TextDecoder is compatible with the DOM type
  globalThis.TextDecoder = TextDecoder;
}
