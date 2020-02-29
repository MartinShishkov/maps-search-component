var commonConfig = require("./webpack.common.js");

console.log("in dev");

commonConfig.mode = 'development';
//commonConfig.devtool = "source-map";
commonConfig.devServer = {
    contentBase: ".",
    host: "localhost"
};

module.exports = commonConfig;