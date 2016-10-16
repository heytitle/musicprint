var webpack = require('webpack');

module.exports = {
    entry: "./src/app.js",
    output: {
        path: __dirname,
        filename: "bundle.js"
    },
    resolve: {
        modulesDirectories: ['node_modules', 'bower_components', 'web_modules']
    },
    plugins: [
        new webpack.ProvidePlugin({
            d3: 'd3',
            _: 'lodash'
        })
    ]
};
