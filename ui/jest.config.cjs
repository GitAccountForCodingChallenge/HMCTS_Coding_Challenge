/** @type {import('jest').Config} */
module.exports = {
    testEnvironment: "jest-fixed-jsdom",

    testEnvironmentOptions: {
        customExportConditions: ["node", "node-addons"]
    },

    setupFilesAfterEnv: [
        "<rootDir>/jest.setup.ts"
    ],

    transform: {
        "^.+\\.[cm]?[jt]sx?$": "babel-jest"
    },

    transformIgnorePatterns: [
        "/node_modules/(?!(msw|@mswjs|@msw|until-async|rettime|strict-event-emitter)/)"
    ],

    moduleFileExtensions: [
        "ts",
        "tsx",
        "js",
        "jsx",
        "mjs",
        "cjs",
        "json"
    ],

    testMatch: [
        "<rootDir>/src/**/*.test.ts",
        "<rootDir>/src/**/*.test.tsx"
    ],

    collectCoverageFrom: [
        "src/**/*.{ts,tsx}",
        "!src/**/*.d.ts",
        "!src/**/*.test.{ts,tsx}",
        "!src/services/generated/**",
        "!src/test/**",
        "!src/main.tsx",
        "!src/App.tsx",
        "!src/app/store.ts",
        "!src/app/Routing.tsx",
        "!src/app/Layout.tsx",
        "!src/pages/HomePage.tsx"
    ]
}
