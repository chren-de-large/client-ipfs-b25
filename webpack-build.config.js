const webpack = require("webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require("path");

module.exports = [{
  entry: ["./src/index.js"],
  module: {
    rules: [{
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ["babel-loader"]
      },
      {
        test: /\.scss$/,
        use: [
          // fallback to style-loader in development
          process.env.NODE_ENV !== "production" ?
          "style-loader" :
          MiniCssExtractPlugin.loader,
          "css-loader",
          "sass-loader"
        ]
      }
    ]
  },
  resolve: {
    extensions: ["*", ".js", ".jsx", ".scss"]
  },
  output: {
    path: path.resolve(__dirname, "docs"),
    publicPath: "/",
    filename: "bundle.js"
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[id].css"
    })
  ]
}];
// DO LATER
// , {
//   entry: ["./src/service-worker.js"],
//   module: {
//     rules: [{
//       test: /\.(js)$/,
//       exclude: /node_modules/,
//       use: ["babel-loader"]
//     }]
//   },
//   resolve: {
//     extensions: [".js"]
//   },
//   output: {
//     path: path.resolve(__dirname, "docs"),
//     publicPath: "/",
//     filename: "sw.js"
//   }
// }