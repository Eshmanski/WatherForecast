const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const  HTMLWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: "development",
    entry: "./src/index.ts",
    output: {
        filename: "script.js",
        path: path.resolve(__dirname, "docs"),
        assetModuleFilename: 'assets/[name][ext]',
    },
    resolve: {
        extensions: [".ts", ".js"]
    },
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: [MiniCssExtractPlugin.loader, "css-loader"],
            },
            {
                test: /\.s[ac]ss$/i,
                use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
            },
            { test: /\.ts$/, loader: "ts-loader" },
        ]
    },
    // performance: {
    //     hints: false,
    //     maxEntrypointSize: 512000,
    //     maxAssetSize: 512000
    // },
    plugins: [
        // new CopyPlugin({
        //     patterns: [ { from: "public", to: "icons" } ],
        // }),

        new HTMLWebpackPlugin({
            template: './src/index.html',
            filename: 'index.html'
        }),
        new MiniCssExtractPlugin({
            filename: 'style.css'
        })
    ]
}

