const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const pages = [
    'examination_detail', 'examination',
    'home', 'index',
    'login', 'paper_analysis',
    'profile'
];


module.exports = {
    mode: process.env.NODE_ENV || 'development',
    entry: Object.assign({
        "ThemeApplier": "./src/client/ThemeApplier.ts",
        "css": "./src/client/scss/main.scss"
    }, pages.reduce((config, page) => {
        config[page] = [`./src/client/${page}.ts`];
        return config;
    }, {})),
    output: {
        filename: "[name].js",
        path: path.resolve(__dirname, "dist", "client"),
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: {
                    loader: "ts-loader",
                    options: {
                        configFile: "tsconfig_client.json",
                    }
                },
                exclude: /node_modules/,
            },
            {
                test: /\.css$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader
                    },
                    {
                        loader: 'css-loader'
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            postcssOptions: {
                                plugins: () => [
                                    require('autoprefixer')
                                ]
                            }
                        }
                    }
                ]
            },
            {
                test: /\.scss$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader
                    },
                    {
                        loader: 'css-loader'
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            postcssOptions: {
                                plugins: () => [
                                    require('autoprefixer')
                                ]
                            }
                        }
                    },
                    {
                        loader: 'sass-loader'
                    }
                ]
            }
        ],
    },
    optimization: {
        splitChunks: {
            chunks: "all",
        },
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js"],
        extensionAlias: {
            ".js": [".js", ".ts"],
            ".cjs": [".cjs", ".cts"],
            ".mjs": [".mjs", ".mts"]
        }
    },
    plugins: [
        new MiniCssExtractPlugin()
    ].concat(
        pages.map(
            (page) =>
                new HtmlWebpackPlugin({
                    inject: true,
                    template: `./src/client/${page}.html`,
                    filename: `${page}.html`,
                    chunks: [page, "css"],
                    scriptLoading: 'blocking'
                })
        )
    ),
};