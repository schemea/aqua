import {Configuration} from "webpack";
import path from "path";
import {CleanWebpackPlugin} from "clean-webpack-plugin";
import HtmlWebpackPlugin from "html-webpack-plugin";
import {TsConfigPathsPlugin} from "awesome-typescript-loader";
import CopyPlugin from "copy-webpack-plugin";


declare module "webpack" {
    interface Configuration {
        devServer: any;
    }
}

const config: Configuration = {
    entry: path.join(__dirname, "src/index.ts"),
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: "awesome-typescript-loader"
            },
            {
                test: /\.scss$/,
                use: [
                    {
                        loader: "style-loader"
                    },
                    {
                        loader: "css-loader"
                    },
                    {
                        loader: "resolve-url-loader"
                    },
                    {
                        loader: "sass-loader",
                        options: {
                            sourceMap: true
                        }
                    }
                ]
            },
            {
                test: /\.glsl$/,
                loader: "raw-loader"
            }
        ]
    },
    resolve: {
        extensions: [
            ".js",
            ".jsx",
            ".ts",
            ".tsx"
        ],
        plugins: [new TsConfigPathsPlugin()]
    },
    mode: "development",
    target: "web",
    devtool: "source-map",
    plugins: [
        new CleanWebpackPlugin(),
        new CopyPlugin([{from: "src/webgl/shaders", to: "shaders"}]),
        new HtmlWebpackPlugin({
            title: "Aqua"
        })
    ],
    devServer: {
        contentBase: path.join(__dirname, "dist"),
        compress: true
    }
};

export default config;
