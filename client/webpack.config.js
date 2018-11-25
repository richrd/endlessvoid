const path = require("path")
const HtmlWebpackPlugin = require("html-webpack-plugin")

const CLIENT_PORT = require("../config.json").client_port

// TODO: move this to ./webpack and differentiate dev and prod config

module.exports = {
    mode: "development",
    entry: "./src/index.ts",
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: "ts-loader",
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: [".ts", ".js"],
    },
    output: {
        filename: "bundle.js",
        path: path.resolve(__dirname, "dist"),
    },
    plugins: [new HtmlWebpackPlugin({ template: "index.html" })],
    devServer: {
        contentBase: path.join(__dirname, "dist"),
        compress: true,
        host: "0.0.0.0",
        port: CLIENT_PORT,
    },
}
