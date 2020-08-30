import path from "path";
import storysource from "@storybook/addon-storysource/loader";

module.exports = {
  mode: "development",
  devtool: "inline-source-map",

  entry: ["./src/app.tsx" /*main*/],
  output: {
    filename: "./bundle.js", // in /dist
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: devMode ? "[name].css" : "[name].[hash].css",
      chunkFilename: devMode ? "[id].css" : "[id].[hash].css",
    }),
  ],
  resolve: {
    // Add `.ts` and `.tsx` as a resolvable extension.
    extensions: [".ts", ".tsx", ".js", ".css", ".scss"],
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        use: [
          {
            loader: require.resolve("ts-loader"),
          },
          // Optional
          {
            loader: require.resolve("react-docgen-typescript-loader"),
          },
        ],
      },

      {
        test: /\.scss$/,
        use: [
          { loader: "postcss-loader" },
          {
            loader: "style-loader",
          }, // to inject the result into the DOM as a style block
          {
            loader: "css-modules-typescript-loader",
          }, // to generate a .d.ts module next to the .scss file (also requires a declaration.d.ts with "declare modules '*.scss';" in it to tell TypeScript that "import styles from './styles.scss';" means to load the module "./styles.scss.d.td")
          {
            loader: "css-loader",
            options: {
              modules: true,
            },
          }, // to convert the resulting CSS to Javascript to be bundled (modules:true to rename CSS classes in output to cryptic identifiers, except if wrapped in a :global(...) pseudo class)
          {
            loader: "sass-loader",
          }, // to convert SASS to CSS
          // NOTE: The first build after adding/removing/renaming CSS classes fails, since the newly generated .d.ts typescript module is picked up only later
        ],
      },
      {
        test: /\.s?css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              sourceMap: true,
            },
          },
          {
            loader: "css-loader",
            options: {
              sourceMap: true,
            },
          },
          {
            loader: "sass-loader",
            options: {
              sourceMap: true,
            },
          },
        ],
      },
    ],
  },
};
