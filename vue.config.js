const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const devMode = process.env.NODE_ENV !== 'production'

module.exports = {
    chainWebpack: config => {
        config.module
            .rule('vue')
            .use('vue-loader')
            .loader('vue-loader')
            .tap(options => Object.assign(options, {
                    transformAssetUrls: {
                        'v-img': ['src', 'lazy-src'],
                        // 'v-card': 'src',
                        // 'v-jumbotron': 'src',
                        // 'v-card-media': 'src',
                        // 'v-responsive': 'src',
                        // ...other Vuetify image-related components
                    }
                    }))                      
    },
    configureWebpack: {
        optimization: {
            splitChunks: {
              chunks: 'all',
              maxAsyncRequests: 20,
              maxInitialRequests: 20,
              maxSize: 100000
            }
        },
        plugins: [
            new MiniCssExtractPlugin({
                // Options similar to the same options in webpackOptions.output
                // both options are optional
                filename: devMode ? '[name].css' : '[name].[hash].css',
                chunkFilename: devMode ? '[id].css' : '[id].[hash].css',
              })
        ],
        module: {
          rules: [
            {
              test: /\.(sa|sc|c)ss$/,
              use: [
                'sass-loader',
              ],
            }
          ]
        }
    }
     // ...other vue-cli plugin options...

    }
