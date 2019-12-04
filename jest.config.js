module.exports = {
    roots: [
        "<rootDir>/src"
    ],
    transform: {
        "\\.tsx?$": "ts-jest"
    },
    moduleNameMapper: {
        "@webgl/(.*)$": "<rootDir>/src/webgl/$1"
    }
};
