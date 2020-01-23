const path = require('path');

module.exports = {
    mode: "development",
    context: path.resolve(__dirname, 'test'),
    entry: './test.js',
    output: {
        path: path.resolve(__dirname, 'test', 'dist'),
        filename: 'test.js',
    },
    module: {
        rules: [
            {
                test: /\.(css|scss)$/,
                use: ['style-loader','css-loader']
            }
        ]
    }
}
