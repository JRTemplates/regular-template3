// 引入依赖
let path = require('path')
let webpack = require('webpack')
let HtmlWebpackPlugin = require('html-webpack-plugin')
let ExtractTextPlugin = require('extract-text-webpack-plugin')
let CopyWebpackPlugin = require('copy-webpack-plugin')
let CleanWebpackPlugin = require('clean-webpack-plugin')
let currentTarget = process.env.npm_lifecycle_event
let OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
let pkg = require('./package.json')
let HashedModuleIdsPlugin = require('./HashedModuleIdsPlugin')
let online = false

if (currentTarget === 'build') {
  online = true
}
var resolve = {
  extensions: ['.js', '.ts', '.sass'],
  // 加个别名，加快库的检索速度
  alias: {
    webApp: path.join(__dirname, './webApp'),
    js: path.join(__dirname, './webApp/js'),
    Regular: 'regularjs'
  }
}
var entry = {}
if (online) {
  entry = {
    index: path.join(__dirname, './webApp/index.js'),
    regular: ['regularjs', 'stateman'],
    JR: ['jr-ui']
  }
} else {
  entry = {
    index: [
      path.join(__dirname, './webApp/index.js'),
      'webpack-hot-middleware/client?reload=true'
    ],
    regular: ['regularjs'],
    JR: ['jr-ui']
  }
}
var output = {
  path: path.join(__dirname, 'dist'),
  publicPath: online ? './' : '/dist',
  filename: online ? 'js/[name]-[chunkhash:8].js' : 'js/[name].js',
  /*
     * 按需加载模块时输出的文件名称
     * */
  chunkFilename: online ? 'js/[name]-[chunkhash:8].js' : 'js/[name].js'
}

var rules = [
  {
    test: /\.html$/,
    exclude: path.resolve(__dirname, 'webApp/index.html'),
    use: 'html-loader'
  },
  {
    test: /\.(png|gif|jpg|jpeg)$/,
    use: ['url-loader?limit=8196&name=images/[name]-[hash:8].[ext]']
  },
  {
    test: /\.(eot|woff|woff2|ttf|svg|oft|otf)$/,
    use: 'url-loader'
  },
  {
    test: /\.ico$/,
    use: ['file-loader']
  },
  // {
  //   test: /\.css$/,
  //   include: path.resolve(__dirname, "node_modules/jr-ui/dist/css/"),
  //   use:["file-loader"]
  // },
  {
    test: /\.css$/,
    exclude: path.resolve(__dirname, 'node_modules/'),
    use: ExtractTextPlugin.extract({
      fallback: 'style-loader',
      use: [
        {
          loader: 'css-loader',
          options: {
            minimize: true
          }
        }
      ]
    })
  },
  {
    test: /\.scss$/,
    use: ExtractTextPlugin.extract({
      fallback: 'style-loader',
      use: ['css-loader', 'sass-loader']
    })
  },
  {
    test: /\.js$/,
    loader: 'eslint-loader',
    enforce: 'pre',
    options: {
      formatter: require('eslint-friendly-formatter')
    }
  },
  {
    test: /\.js$/,
    loader: 'babel-loader?cacheDirectory'
  }
]

var plugins = [
  // 拷贝资源`
  new CopyWebpackPlugin([
    {
      from: path.join(
        __dirname,
        `node_modules/jr-ui/dist/css/JR.${pkg.style}.min.css`
      ),
      to: path.join(__dirname, 'dist/css/JR.min.css')
    },
    {
      from: path.join(__dirname, 'node_modules/jr-ui/dist/fonts'),
      to: path.join(__dirname, 'dist/fonts')
    },
    {
      from: path.join(__dirname, 'webApp/images/ico'),
      to: path.join(__dirname, 'dist')
    }
  ]),
  new webpack.optimize.CommonsChunkPlugin({
    names: ['JR', 'regular'],
    minChunks: Infinity
  }),

  new webpack.optimize.CommonsChunkPlugin({
    name: 'manifest',
    chunks: ['JR', 'regular']
  }),
  new OptimizeCSSPlugin(),
  new webpack.DefinePlugin({}),
  new HashedModuleIdsPlugin(),

  /*
     * 提取css文件到单独的文件中
     */
  new ExtractTextPlugin({
    filename: online ? 'css/[name]-[contenthash:8].css' : 'css/[name].css',
    allChunks: false
  }),

  /*
     * 创建html文件
     * */
  new HtmlWebpackPlugin({
    filename: 'index.html',
    title: pkg.title,
    template: path.join(__dirname, './webApp/index.html'),
    inject: true,
    // 需要依赖的模块
    chunks: ['manifest', 'regular', 'JR', 'index'],
    // chunksSortMode: "none",
    minify: {
      removeComments: true,
      collapseWhitespace: true,
      removeAttributeQuotes: true
    }
  })
]

// 必须在开发环境是使用，这2个函数会导致chunkhash报错
if (!online) {
  plugins.push(
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin()
    // new webpack.NoEmitOnErrorsPlugin(),
    // webpack3 加这东西热部署有问题
    // new webpack.optimize.ModuleConcatenationPlugin(),
  )
}

var config = {
  entry: entry,
  resolveLoader: {
    modules: [path.join(__dirname, 'node_modules')]
  },
  output: output,
  devtool: false,
  module: {
    rules: rules
  },
  externals: {},
  resolve: resolve,
  plugins: plugins
}

if (online) {
  plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      // 最紧凑的输出
      beautify: false,
      compress: {
        drop_debugger: true,
        // drop_console: true,
        warnings: false
      },
      mangle: true,
      output: {
        comments: false
      }
    }),
    // build的时候删除dist文件夹，跨平台删除
    new CleanWebpackPlugin(path.join(__dirname, './dist'))
  )
} else {
}
module.exports = config
