import path from 'path';
import webpack, { Configuration as WebpackConfiguration } from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import { Configuration as WebpackDevServerConfiguration } from 'webpack-dev-server';

const { WebpackManifestPlugin } = require('webpack-manifest-plugin');

interface Configuration extends WebpackConfiguration {
  devServer?: WebpackDevServerConfiguration;
}

const isDevelopment = process.env.NODE_ENV !== 'production';

const config: Configuration = {
  name: 'react-setup-without-cra',
  mode: isDevelopment ? 'development' : 'production',
  devtool: isDevelopment ? 'hidden-source-map' : 'inline-source-map',
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
    alias: {
      '@hooks': path.resolve(__dirname, 'hooks'),
      '@components': path.resolve(__dirname, 'components'),
      '@layouts': path.resolve(__dirname, 'layouts'),
      '@pages': path.resolve(__dirname, 'pages'),
      '@utils': path.resolve(__dirname, 'utils'),
      '@typings': path.resolve(__dirname, 'typings'),
    },
  },
  entry: {
    app: './src/index',
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'babel-loader',
        options: {
          presets: [
            [
              '@babel/preset-env',
              {
                targets: { browsers: ['last 2 chrome versions'] },
                debug: isDevelopment,
                useBuiltIns: 'entry',
              },
            ],
            '@babel/preset-react',
            '@babel/preset-typescript',
          ],
          env: {
            development: {
              plugins: [require.resolve('react-refresh/babel')],
            },
          },
        },
        exclude: ['/node_modules'],
      },
      {
        test: /\.css?$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(ico|png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'url-loader',
        options: {
          name: '[hash].[ext]',
          limit: 10000,
        },
      },
    ],
  },
  plugins: [
    new webpack.EnvironmentPlugin({
      NODE_ENV: isDevelopment ? 'development' : 'production',
    }),
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
    new ForkTsCheckerWebpackPlugin({
      async: false,
    }),
    new WebpackManifestPlugin(),
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].js',
    publicPath: '/dist/',
    clean: true,
  },
  devServer: {
    historyApiFallback: true,
    port: 3000,
    open: true,
    hot: true,
    compress: true,
  },
};

if (isDevelopment && config.plugins) {
  config.plugins.push(new webpack.HotModuleReplacementPlugin());
  config.plugins.push(new ReactRefreshWebpackPlugin());
}
if (!isDevelopment && config.plugins) {
  config.plugins.push(new webpack.LoaderOptionsPlugin({ minimize: true }));
}

export default config;
