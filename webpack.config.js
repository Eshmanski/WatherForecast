const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const  HTMLWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: "production",
    entry: "./src/main.ts",
    output: {
        filename: "script.js",
        path: path.resolve(__dirname, "docs"),
    },
    resolve: {
        extensions: [".ts", ".js"]
    },
    module: {
        rules: [
            {
                test: /\.s[ac]ss$/i,
                use: [ MiniCssExtractPlugin.loader, "css-loader", "sass-loader" ],
            },
            { test: /\.ts$/, loader: "awesome-typescript-loader" },
        ]
    },
    plugins: [
        new CopyPlugin({
            patterns: [ { from: "public", to: "icons" } ],
        }),
        new MiniCssExtractPlugin({ filename: "styles.css" }),
        new HTMLWebpackPlugin({
            template: './src/index.html',
            filename: 'index.html'
        })
    ]
}

