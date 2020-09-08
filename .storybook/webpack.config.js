const path = require("path");
const SRC_PATH = path.join(__dirname, "../src");
const STORIES_PATH = path.join(__dirname, "../stories");
//dont need stories path if you have your stories inside your //components folder
module.exports = ({ config }) => {
  config.module.rules.push({
    test: /\.(ts|tsx)$/,
    include: [SRC_PATH, STORIES_PATH],
    use: [
      {
        loader: require.resolve("awesome-typescript-loader"),
        options: {
          configFileName: "./.storybook/tsconfig.json",
        },
      },
      { loader: require.resolve("react-docgen-typescript-loader") },
    ],
  });

  config.module.rules.find(
    (rule) => rule.test.toString() === "/\\.css$/"
  ).exclude = /\.module\.css$/;

  config.module.rules.push({
    test: /\.module\.css$/,
    use: [
      "style-loader",
      "css-modules-typescript-loader",
      {
        loader: "css-loader",
        options: {
          modules: true,
        },
      },
    ],
  });
  config.resolve.extensions.push(".ts", ".tsx");
  config.resolve.extensions.push(".css");

  return config;
};