import type { Config } from "jest";
import nextJest from "next/jest.js";

const createJestConfig = nextJest({
   // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
   dir: "./",
});

// Add any custom config to be passed to Jest
const config: Config = {
   coverageProvider: "v8",
   clearMocks: true,
   collectCoverage: true,
   coverageDirectory: "coverage",
   testEnvironment: "jsdom",
   setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
   moduleNameMapper: {
      "^@/(.*)$": "<rootDir>/src/$1",
   },
};

const esModules = ["@buidlerlabs/hashgraph-react-wallets"].join("|");

module.exports = async () => ({
   /**
    * Using ...(await createJestConfig(customJestConfig)()) to override transformIgnorePatterns
    * provided byt next/jest.
    *
    * @link https://github.com/vercel/next.js/issues/36077#issuecomment-1096635363
    */
   ...(await createJestConfig(config)()),
   /**
    * Swiper uses ECMAScript Modules (ESM) and Jest provides some experimental support for it
    * but "node_modules" are not transpiled by next/jest yet.
    *
    * @link https://github.com/vercel/next.js/issues/36077#issuecomment-1096698456
    * @link https://jestjs.io/docs/ecmascript-modules
    */
   transformIgnorePatterns: [`<rootDir>/node_modules/(?!${esModules})/`],
});
