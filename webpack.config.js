const webpack = require("webpack");
const path = require("path");

module.exports = {
    entry: {
        index: "./static/dist/front/index",
    },
    output: {
        path: path.join(__dirname, "static/scripts/"),
        filename: "[name].js"
    },
    plugins: [
        new webpack.DefinePlugin({
            "process.env": {
                "NODE_ENV": JSON.stringify("production")
            }
        }),
        new webpack.NoEmitOnErrorsPlugin(),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false,
            },
            output: {
                comments: false,
            },
        }),
    ],
};
