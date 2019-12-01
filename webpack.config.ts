import { Configuration } from "webpack";
import path from "path";
import { CleanWebpackPlugin } from "clean-webpack-plugin";
import HtmlWebpackPlugin from "html-webpack-plugin";
import { TsConfigPathsPlugin } from "awesome-typescript-loader";
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
                loader: "awesome-typescript-loader",
            },
            {
                test: /\.scss$/,
                use: [
                    {
                        loader: "style-loader",
                    },
                    {
                        loader: "css-loader",
                    },
                    {
                        loader: "resolve-url-loader",
                    },
                    {
                        loader: "sass-loader",
                        options: {
                            sourceMap: true,
                        },
                    },
                ],
            },
            {
                test: /\.glsl$/,
                loader: "raw-loader",
            },
        ],
    },
    resolve: {
        extensions: [
            ".js",
            ".jsx",
            ".ts",
            ".tsx",
        ],
        plugins: [ new TsConfigPathsPlugin() ],
    },
    target: "web",
    plugins: [
        new CleanWebpackPlugin(),
        new CopyPlugin([ { from: "src/webgl/shaders", to: "shaders" } ]),
        new HtmlWebpackPlugin({
            title: "Aqua",
        }),
    ],
    devServer: {
        contentBase: path.join(__dirname, "dist"),
        compress: true,
    },
};

switch (process.env.NODE_ENV as Configuration["mode"]) {
    case "development":
    case "production":
        config.mode = process.env.NODE_ENV as Configuration["mode"];
        break;
    case "none":
    default:
        config.mode = "development";
        break;
}

if (config.mode === "development") {
    config.devtool = "source-map";
}

export default config;
