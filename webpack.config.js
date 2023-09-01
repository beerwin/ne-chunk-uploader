// Generated using webpack-cli https://github.com/webpack/webpack-cli

import path from 'path'
import { fileURLToPath } from 'url'
import TerserPlugin from 'terser-webpack-plugin'
const __dirname = path.dirname(fileURLToPath(import.meta.url))

const isProduction = process.env.NODE_ENV === 'production'

const config = {
  entry: {
    'ne-chunk-uploader': ['./src/index.js']
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    asyncChunks: true,
    filename: '[name].bundle.js',
    library: {
      name: 'NEChunkUploaderLib',
      type: 'umd'
    },
    globalObject: 'this',
    umdNamedDefine: true
  },
  plugins: [
    // Add your plugins here
    // Learn more about plugins from https://webpack.js.org/configuration/plugins/
  ],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/i,
        loader: 'babel-loader',
        exclude: /node_modules/
      }

      // Add your rules for custom modules here
      // Learn more about loaders from https://webpack.js.org/loaders/
    ]
  },
  optimization: {
    minimizer: [new TerserPlugin({
      extractComments: false
    })]
  }
}

export default () => {
  if (isProduction) {
    config.mode = 'production'
  } else {
    config.mode = 'development'
  }
  return config
}
