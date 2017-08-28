const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const CommonsChunkPlugin = require('webpack/lib/optimize/CommonsChunkPlugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
const WebpackMd5Hash = require('webpack-md5-hash');
const autoprefixer = require('autoprefixer');
const precss = require('precss');
let resolve = (dir) => {
    return path.join(__dirname, '..', dir)
}
const env = (process.env.NODE_ENV || 'development');
console.log(env);
const dirUrl = path.resolve('./views');
let titles = require('./titles');
let files = fs.readdirSync(dirUrl);
let entry = {
    ventor: ['vue', 'babel-polyfill', 'axios']
};
let HtmlWebpack = [];
files.map(file => {
    let entryJS = file.replace('.js', '');
    entry[entryJS] = `./views/${file}`;
    let htmlConfig = {
        title: titles[entryJS],
        favicon: './images/logo.png',
        chunks: ['ventor', entryJS],
        inject: 'body',
        hash: true,
        filename: path.resolve(__dirname, `html/${entryJS}.html`),
        template: './index.ejs',
        minify: {//压缩HTML文件
            removeComments: true,    //移除HTML中的注释
            collapseWhitespace: true    //删除空白符与换行符
        }
    };
    HtmlWebpack.push(new HtmlWebpackPlugin(htmlConfig));

});
const config = {
    entry,
    output: {
        path: path.resolve('./dist'),
        filename: '[name].js',
        chunkFilename: '[id].chunk.js',
        publicPath: '/dist/'
    },
    resolve: {
        extensions: ['.js', '.vue', '.json'],
        alias: {
            '@': resolve('src'),
            'vue$': 'vue/dist/vue.common.js'
        }
    },
    module: {
        rules: [
            {
                test: /\.(js|vue)$/,
                loader: 'eslint-loader',
                enforce: 'pre',
                exclude: [/node_modules/],
                options: {
                    formatter: require('eslint-friendly-formatter')
                }
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            {
                test: /\.js$/,
                loader: 'babel-loader'
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 4048,
                    name: '[name].[hash:8].[ext]'
                }
            },
            {
                test: /\.less$/,
                loader: 'style-loader!css-loader!postcss-loader!less-loader'
            },
            {
                test: /\.css$/,
                loader: 'style-loader!css-loader!postcss-loader'


            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: '[name].[hash:8].[ext]'
                }
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin(['./dist', './html']),
        new CommonsChunkPlugin({
            names: ['ventor'],
            minChunks: Infinity
        }),
        new webpack.NoEmitOnErrorsPlugin(),
        ...HtmlWebpack,
        new FriendlyErrorsPlugin()
    ],
    devtool: '#eval-source-map'
}
if (env == 'production' || env == 'test') {
    console.log('------->', env)
    config.devtool = '';
    config.output.publicPath = '/dist/';
    if (env === 'production') {
        config.output.publicPath = '/dist/';
    }
    config.output.filename = '[name].[chunkhash:8].js';
    config.output.chunkFilename = '[chunkhash:8].[id].chunk.js';
    config.plugins = (config.plugins || []).concat([
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': '"production"',
                'kingold': JSON.stringify(env)
            }
        }),
        new webpack.optimize.UglifyJsPlugin({
            sourceMap: true,
            comments: false,
            compress: {
                warnings: false,
                drop_console: env == 'production' ? true : false
            }
        }),
        new WebpackMd5Hash(),
        new webpack.LoaderOptionsPlugin({
            minimize: true
        })
    ]);
} else {
    console.log('dev');
}
module.exports = config;
