import runTests from "./abstraction"
import {createRequire} from "node:module"
var require = createRequire(import.meta.url);
await runTests([], [
  {
    // test "exports" field in package.json when running vitest
    normalCJS: require("@ublitzjs/channel"),
    // test "exports" field in package.json when running vitest
    normalESM: await import("@ublitzjs/channel"),
    // name of testing function from "all.ts"
    test: "testChannel",
    // name of file in 'src' with .js extension to be minified and bundled 
    name: "index.js"
  },
])
