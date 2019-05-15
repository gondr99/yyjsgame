const path = require('path');
const MiniCssExtractor = require('mini-css-extract-plugin');

module.exports = {
    entry: ['./js/App.js'],
    output: {
        path: path.resolve(__dirname, "public"),
        filename: 'app.js'
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    {
                        loader:MiniCssExtractor.loader,
                        options:{
                            hmr:process.env.NODE_ENV === 'development'
                        }
                    },
                    'css-loader']
            }
        ]
    },
    plugins: [
        new MiniCssExtractor({ filename: 'style.css' })
    ],
    resolve: {
        modules: ['node_modules'],
        extensions: ['.js', '.json', '.jsx', '.css'],
    },
}