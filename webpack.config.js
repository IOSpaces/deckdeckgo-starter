const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');

const DeckDeckGoInfoPlugin = require('./webpack.info.plugin');
const DeckDeckGoMarkdownPlugin = require('deckdeckgo-webpack-markdown-plugin');

const {GenerateSW} = require('workbox-webpack-plugin');

const webpack = require('webpack');

const path = require('path');

const config = {
    entry: './src/index.js',
    output: {
        filename: '[name].[chunkhash].js',
        path: path.resolve(__dirname, 'dist')
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            }
        ]
    }
};

const plugins = [
    new CleanWebpackPlugin(['dist']),
    new HtmlWebpackPlugin({
        hash: true,
        inject: true,
        template: './src/index.html',
        path: path.join(__dirname, '../dist/'),
        filename: 'index.html'
    }),
    new CopyWebpackPlugin([
        {from: 'src/assets/', to: 'assets'},
        {from: 'src/manifest.json', to: ''},
        {from: 'src/robots.txt', to: ''},
        {from: 'node_modules/ionicons/dist/ionicons/svg/', to: 'svg'}
    ]),
    new ProgressBarPlugin(),
    new DeckDeckGoMarkdownPlugin()
];

module.exports = (env, argv) => {

    if (argv.mode === 'development' || argv.mode === 'local') {
        config.devtool = 'source-map';
    }

    if (argv.mode === 'production') {
        plugins.push(new GenerateSW());
        plugins.push(new DeckDeckGoInfoPlugin());
    }

    config.plugins = plugins;

    let processEnv;

    if (env && env.local) {
        processEnv = {
            'process.env': {
                SIGNALING_SERVER: JSON.stringify('http://localhost:3002')
            }
        };
    } else {
        processEnv = {
            'process.env': {
                SIGNALING_SERVER: JSON.stringify('https://api.deckdeckgo.com')
            }
        };
    }

    // Following value will be updated by the create-deckdeckgo CLI
    processEnv['process.env']['ROOM_NAME'] = JSON.stringify('{{DECKDECKGO_TITLE}}');

    if (env && env.noRemote) {
        processEnv['process.env']['NO_REMOTE'] = true;
    }

    plugins.push(
        new webpack.DefinePlugin(processEnv)
    );

    return config;
};