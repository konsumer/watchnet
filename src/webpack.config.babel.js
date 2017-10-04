import { DefinePlugin, optimize } from 'webpack'
import { resolve } from 'path'
const { ModuleConcatenationPlugin } = optimize

// exposed environemnt
const env = {
  'process.env': {
    NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'development')
  }
}

const config = {
  entry: {
    app: [
      resolve(__dirname, './index.js')
    ]
  },
  output: {
    path: resolve(__dirname, '../public/build'), // YOUR OUTPUT LOCATION
    publicPath: '/build/',
    filename: '[name].js'
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              plugins: [
                'transform-react-jsx',
                'transform-object-rest-spread'
              ],
              presets: ['env']
            }
          }
        ]
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader',
            options: {
              minimize: process.env.NODE_ENV === 'production',
              sourceMap: process.env.NODE_ENV !== 'production',
              modules: true
            }
          },
          {
            loader: 'resolve-url-loader'
          }
        ]
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader',
            options: {
              minimize: process.env.NODE_ENV === 'production',
              sourceMap: process.env.NODE_ENV !== 'production'
            }
          },
          {
            loader: 'resolve-url-loader'
          },
          {
            loader: 'sass-loader'
          }
        ]
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        use: [
          {
            loader: 'file-loader?hash=sha512&digest=hex&name=[hash].[ext]'
          },
          {
            loader: 'image-webpack-loader',
            options: {
              mozjpeg: {
                progressive: true
              },
              gifsicle: {
                interlaced: false
              },
              optipng: {
                optimizationLevel: 4
              },
              pngquant: {
                quality: '75-90',
                speed: 3
              }
            }
          }
        ]

      },
      {
        test: /\.((woof|woff2|ttf|eot)(\?v=[0-9]\.[0-9]\.[0-9]))|(woff|woff2|ttf|eot)$/,
        use: [
          {
            loader: 'file-loader'
          }
        ]
      }
    ]
  },
  plugins: [
    new DefinePlugin(env)
  ]
}

if (process.env.NODE_ENV === 'production') {
  config.plugins.push(new ModuleConcatenationPlugin())
  config.loaders[0].use[0].options.presets.push('babili')
} else {
  config.devtool = 'cheap-source-map'
}

export default config
