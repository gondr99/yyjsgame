const path = require('path');
const MiniCssExtractor = require('mini-css-extract-plugin');

module.exports = {
    entry:['./js/App.js'],
    output:{
        path:path.resolve(__dirname, "public"),
        filename:'app.js'
    },
    module:{
        rules:[
            {
                test:/\.css$/,
                use:[MiniCssExtractor, 'css-loader']
            }
        ]
    },
    plugins:[
        new MiniCssExtractor({filename:'style.css'})
    ]
}