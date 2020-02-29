"use strict";

var path = require("path");
console.log(__dirname);

module.exports = {
    entry: {
        "d.index": "./src/Index.tsx"
        //"m.home.index": "./src/app/mobile/m.home.index.tsx",
    },
    output: {
        path: path.resolve(__dirname, 'public/build/js'),
        filename: "[name].bundle.js",
        chunkFilename: "[name].chunk.js"
    },
    module: {
        rules: [
            {
                test: /\.(ts|tsx)?$/,
                use: "awesome-typescript-loader",
                exclude: /node_modules/
            },
            {
                test: /\.(css|less)?$/,
                use: [{
                    loader: "style-loader"
                }, {
                    loader: "css-loader?modules&localIdentName=[local]--[hash:base64:5]"
                }, {
                    loader: "less-loader"
                }]
            }
        ]
    },
    resolve: {
        extensions: [".js", ".jsx", ".ts", ".tsx", ".css", ".less"]
    }
};