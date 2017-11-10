
const helpers = require('./helpers');
const webpackMerge = require('webpack-merge'); // used to merge webpack configs
const commonConfig = require('./webpack.common.js'); // the settings that are common to prod and dev

const autoprefixer = require('autoprefixer');
const postcssUrl = require('postcss-url');
/**
 * Webpack Plugins
 */
const DefinePlugin = require('webpack/lib/DefinePlugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const IgnorePlugin = require('webpack/lib/IgnorePlugin');
const LoaderOptionsPlugin = require('webpack/lib/LoaderOptionsPlugin');
const NormalModuleReplacementPlugin = require('webpack/lib/NormalModuleReplacementPlugin');
const ProvidePlugin = require('webpack/lib/ProvidePlugin');
const UglifyJsPlugin = require('webpack/lib/optimize/UglifyJsPlugin');
const OptimizeJsPlugin = require('optimize-js-plugin');

const fs = require('fs');
const path = require('path');
const ProgressPlugin = require('webpack/lib/ProgressPlugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const { NoEmitOnErrorsPlugin, SourceMapDevToolPlugin, NamedModulesPlugin } = require('webpack');
const { GlobCopyWebpackPlugin, BaseHrefWebpackPlugin } = require('@angular/cli/plugins/webpack');
const { CommonsChunkPlugin } = require('webpack').optimize;
const { AotPlugin } = require('@ngtools/webpack');

const nodeModules = path.join(process.cwd(), 'node_modules');
const realNodeModules = fs.realpathSync(nodeModules);
const genDirNodeModules = path.join(process.cwd(), 'src', '$$_gendir', 'node_modules');
const entryPoints = ["inline","polyfills","sw-register","styles","vendor","main"];

const minimizeCss = false;
const baseHref = "";
const deployUrl = "";

/**
 * Webpack Constants
 */
const ENV = process.env.NODE_ENV = process.env.ENV = 'production';
const HOST = process.env.HOST || 'localhost';
const PORT = process.env.PORT || 8000;
const METADATA = webpackMerge(commonConfig({
  env: ENV
}).metadata, {
  host: HOST,
  port: PORT,
  ENV: ENV,
  HMR: false
});

const postcssPlugins = function () {
  // safe settings based on: https://github.com/ben-eb/cssnano/issues/358#issuecomment-283696193
  const importantCommentRe = /@preserve|@license|[@#]\s*source(?:Mapping)?URL|^!/i;
  const minimizeOptions = {
    autoprefixer: false,
    safe: true,
    mergeLonghand: false,
    discardComments: { remove: (comment) => !importantCommentRe.test(comment) }
  };
  return [
    postcssUrl({
      url: (URL) => {
        // Only convert root relative URLs, which CSS-Loader won't process into require().
        if (!URL.startsWith('/') || URL.startsWith('//')) {
          return URL;
        }
        if (deployUrl.match(/:\/\//)) {
          // If deployUrl contains a scheme, ignore baseHref use deployUrl as is.
          return `${deployUrl.replace(/\/$/, '')}${URL}`;
        }
        else if (baseHref.match(/:\/\//)) {
          // If baseHref contains a scheme, include it as is.
          return baseHref.replace(/\/$/, '') +
            `/${deployUrl}/${URL}`.replace(/\/\/+/g, '/');
        }
        else {
          // Join together base-href, deploy-url and the original URL.
          // Also dedupe multiple slashes into single ones.
          return `/${baseHref}/${deployUrl}/${URL}`.replace(/\/\/+/g, '/');
        }
      }
    }),
    autoprefixer(),
  ].concat(minimizeCss ? [cssnano(minimizeOptions)] : []);
};

module.exports = {
  // env = 'production';
  // isProd = env === 'production';
  // //minimizeCss = true;
  // return webpackMerge(commonConfig({
  //   env: ENV
  // }), {
  //   /**
  //    * Developer tool to enhance debugging
  //    *
  //    * See: http://webpack.github.io/docs/configuration.html#devtool
  //    * See: https://github.com/webpack/docs/wiki/build-performance#sourcemaps
  //    */
    "resolve": {
      "extensions": [
        ".ts",
        ".js"
      ],
      "modules": [
        "./node_modules",
        "./node_modules"
      ],
      "symlinks": true
    },
    "resolveLoader": {
      "modules": [
        "./node_modules",
        "./node_modules"
      ]
    },
    "entry": {
      "main": [
        "./src/main.ts"
      ],
      "polyfills": [
        "./src/polyfills.ts"
      ],
      "styles": [
        "./src/styles.scss"
      ]
    },
    "output": {
      "path": helpers.root('dist'), // path.join(process.cwd(), "dist"),
      "filename": "[name].bundle.js",
      "sourceMapFilename": "[name].[chunkhash].bundle.map",
      "chunkFilename": "[id].chunk.js"
    },
    "node": {
        "global": true,
        "crypto": "empty",
        "process": false,
        "module": false,
        "clearImmediate": false,
        "setImmediate": false
    },
    'devServer': {
        'historyApiFallback': true,
        'host': '0.0.0.0',
        'port': 80
    },
    "module": {
      "rules": [
        {
          "enforce": "pre",
          "test": /\.js$/,
          "loader": "source-map-loader",
          "exclude": [
            /\/node_modules\//
          ]
        },
        {
          "test": /\.json$/,
          "loader": "json-loader"
        },
        {
          "test": /\.html$/,
          "loader": "raw-loader"
        },
        {
          "test": /\.(eot|svg)$/,
          "loader": "file-loader?name=[name].[hash:20].[ext]"
        },
        {
          "test": /\.(jpg|png|webp|gif|otf|ttf|woff|woff2|cur|ani)$/,
          "loader": "url-loader?name=[name].[hash:20].[ext]&limit=10000"
        },
        {
          "exclude": [
            path.join(process.cwd(), "src/styles.scss")
          ],
          "test": /\.css$/,
          "use": [
            "exports-loader?module.exports.toString()",
            {
              "loader": "css-loader",
              "options": {
                "sourceMap": false,
                "importLoaders": 1
              }
            },
            {
              "loader": "postcss-loader",
              "options": {
                "ident": "postcss",
                "plugins": postcssPlugins
              }
            }
          ]
        },
        {
          "exclude": [
            path.join(process.cwd(), "src/styles.scss")
          ],
          "test": /\.scss$|\.sass$/,
          "use": [
            "exports-loader?module.exports.toString()",
            {
              "loader": "css-loader",
              "options": {
                "sourceMap": false,
                "importLoaders": 1
              }
            },
            {
              "loader": "postcss-loader",
              "options": {
                "ident": "postcss",
                "plugins": postcssPlugins
              }
            },
            {
              "loader": "sass-loader",
              "options": {
                "sourceMap": false,
                "precision": 8,
                "includePaths": []
              }
            }
          ]
        },
        {
          "exclude": [
            path.join(process.cwd(), "src/styles.scss")
          ],
          "test": /\.less$/,
          "use": [
            "exports-loader?module.exports.toString()",
            {
              "loader": "css-loader",
              "options": {
                "sourceMap": false,
                "importLoaders": 1
              }
            },
            {
              "loader": "postcss-loader",
              "options": {
                "ident": "postcss",
                "plugins": postcssPlugins
              }
            },
            {
              "loader": "less-loader",
              "options": {
                "sourceMap": false
              }
            }
          ]
        },
        {
          "exclude": [
            path.join(process.cwd(), "src/styles.scss")
          ],
          "test": /\.styl$/,
          "use": [
            "exports-loader?module.exports.toString()",
            {
              "loader": "css-loader",
              "options": {
                "sourceMap": false,
                "importLoaders": 1
              }
            },
            {
              "loader": "postcss-loader",
              "options": {
                "ident": "postcss",
                "plugins": postcssPlugins
              }
            },
            {
              "loader": "stylus-loader",
              "options": {
                "sourceMap": false,
                "paths": []
              }
            }
          ]
        },
        {
          "include": [
            path.join(process.cwd(), "src/styles.scss")
          ],
          "test": /\.css$/,
          "use": [
            "style-loader",
            {
              "loader": "css-loader",
              "options": {
                "sourceMap": false,
                "importLoaders": 1
              }
            },
            {
              "loader": "postcss-loader",
              "options": {
                "ident": "postcss",
                "plugins": postcssPlugins
              }
            }
          ]
        },
        {
          "include": [
            path.join(process.cwd(), "src/styles.scss")
          ],
          "test": /\.scss$|\.sass$/,
          "use": [
            "style-loader",
            {
              "loader": "css-loader",
              "options": {
                "sourceMap": false,
                "importLoaders": 1
              }
            },
            {
              "loader": "postcss-loader",
              "options": {
                "ident": "postcss",
                "plugins": postcssPlugins
              }
            },
            {
              "loader": "sass-loader",
              "options": {
                "sourceMap": false,
                "precision": 8,
                "includePaths": []
              }
            }
          ]
        },
        {
          "include": [
            path.join(process.cwd(), "src/styles.scss")
          ],
          "test": /\.less$/,
          "use": [
            "style-loader",
            {
              "loader": "css-loader",
              "options": {
                "sourceMap": false,
                "importLoaders": 1
              }
            },
            {
              "loader": "postcss-loader",
              "options": {
                "ident": "postcss",
                "plugins": postcssPlugins
              }
            },
            {
              "loader": "less-loader",
              "options": {
                "sourceMap": false
              }
            }
          ]
        },
        {
          "include": [
            path.join(process.cwd(), "src/styles.scss")
          ],
          "test": /\.styl$/,
          "use": [
            "style-loader",
            {
              "loader": "css-loader",
              "options": {
                "sourceMap": false,
                "importLoaders": 1
              }
            },
            {
              "loader": "postcss-loader",
              "options": {
                "ident": "postcss",
                "plugins": postcssPlugins
              }
            },
            {
              "loader": "stylus-loader",
              "options": {
                "sourceMap": false,
                "paths": []
              }
            }
          ]
        },
        {
          "test": /\.ts$/,
          "loader": "@ngtools/webpack"
        }
      ]
    },
    "plugins": [
      new OptimizeJsPlugin({
        sourceMap: false
      }),
      new ExtractTextPlugin('[name].[contenthash].css'),
      new NoEmitOnErrorsPlugin(),
      new GlobCopyWebpackPlugin({
        "patterns": [
          "assets",
          "favicon.ico"
        ],
        "globOptions": {
          "cwd": path.join(process.cwd(), "src"),
          "dot": true,
          "ignore": "**/.gitkeep"
        }
      }),
      /**
       * Plugin: DefinePlugin
       * Description: Define free variables.
       * Useful for having development builds with debug logging or adding global constants.
       *
       * Environment helpers
       *
       * See: https://webpack.github.io/docs/list-of-plugins.html#defineplugin
       */
      // NOTE: when adding more properties make sure you include them in custom-typings.d.ts
      new DefinePlugin({
        'ENV': JSON.stringify(METADATA.ENV),
        'HMR': METADATA.HMR,
        'process.env': {
          'ENV': JSON.stringify(METADATA.ENV),
          'NODE_ENV': JSON.stringify(METADATA.ENV),
          'HMR': METADATA.HMR,
        }
      }),
      new ProgressPlugin(),
      new SourceMapDevToolPlugin({
        "filename": "[file].map[query]",
        "moduleFilenameTemplate": "[resource-path]",
        "fallbackModuleFilenameTemplate": "[resource-path]?[hash]",
        "sourceRoot": "webpack:///"
      }),
      new HtmlWebpackPlugin({
        "template": "./src/index.html",
        "filename": "./index.html",
        "hash": false,
        "inject": true,
        "compile": true,
        "favicon": false,
        "minify": false,
        "cache": true,
        "showErrors": true,
        "chunks": "all",
        "excludeChunks": [],
        "title": "Webpack App",
        "xhtml": true,
        "chunksSortMode": function sort(left, right) {
          let leftIndex = entryPoints.indexOf(left.names[0]);
          let rightindex = entryPoints.indexOf(right.names[0]);
          if (leftIndex > rightindex) {
              return 1;
          }
          else if (leftIndex < rightindex) {
              return -1;
          }
          else {
              return 0;
          }
      }
      }),
      new BaseHrefWebpackPlugin({}),
      new CommonsChunkPlugin({
        "minChunks": 2,
        "async": "common"
      }),
      new CommonsChunkPlugin({
        "name": [
          "inline"
        ],
        "minChunks": null
      }),
      new CommonsChunkPlugin({
        "name": [
          "vendor"
        ],
        "minChunks": (module) => {
                  return module.resource
                      && (module.resource.startsWith(nodeModules)
                          || module.resource.startsWith(genDirNodeModules)
                          || module.resource.startsWith(realNodeModules));
              },
        "chunks": [
          "main"
        ]
      }),
      /**
       * Plugin: UglifyJsPlugin
       * Description: Minimize all JavaScript output of chunks.
       * Loaders are switched into minimizing mode.
       *
       * See: https://webpack.github.io/docs/list-of-plugins.html#uglifyjsplugin
       */
      // NOTE: To debug prod builds uncomment //debug lines and comment //prod lines
      new UglifyJsPlugin({
        // beautify: true, //debug
        // mangle: false, //debug
        // dead_code: false, //debug
        // unused: false, //debug
        // deadCode: false, //debug
        // compress: {
        //   screw_ie8: true,
        //   keep_fnames: true,
        //   drop_debugger: false,
        //   dead_code: false,
        //   unused: false
        // }, // debug
        // comments: true, //debug


        beautify: false, //prod
        output: {
          comments: false
        }, //prod
        mangle: {
          screw_ie8: true
        }, //prod
        compress: {
          screw_ie8: true,
          warnings: false,
          conditionals: true,
          unused: true,
          comparisons: true,
          sequences: true,
          dead_code: true,
          evaluate: true,
          if_return: true,
          join_vars: true,
          negate_iife: false // we need this for lazy v8
        },
      }),

      /**
       * Plugin: NormalModuleReplacementPlugin
       * Description: Replace resources that matches resourceRegExp with newResource
       *
       * See: http://webpack.github.io/docs/list-of-plugins.html#normalmodulereplacementplugin
       */

      new NormalModuleReplacementPlugin(
        /angular2-hmr/,
        helpers.root('config/empty.js')
      ),

      new NormalModuleReplacementPlugin(
        /zone\.js(\\|\/)dist(\\|\/)long-stack-trace-zone/,
        helpers.root('config/empty.js')
      ),

      /**
       * Plugin LoaderOptionsPlugin (experimental)
       *
       * See: https://gist.github.com/sokra/27b24881210b56bbaff7
       */
      new LoaderOptionsPlugin({
        minimize: true,
        debug: false,
        options: {

          /**
           * Html loader advanced options
           *
           * See: https://github.com/webpack/html-loader#advanced-options
           */
          // TODO: Need to workaround Angular 2's html syntax => #id [bind] (event) *ngFor
          htmlLoader: {
            minimize: true,
            removeAttributeQuotes: false,
            caseSensitive: true,
            customAttrSurround: [
              [/#/, /(?:)/],
              [/\*/, /(?:)/],
              [/\[?\(?/, /(?:)/]
            ],
            customAttrAssign: [/\)?\]?=/]
          },

        }
      }),
      new NamedModulesPlugin({}),
      new AotPlugin({
        "mainPath": "main.ts",
        "hostReplacementPaths": {
          "environments/environment.ts": "environments/environment.ts"
        },
        "exclude": [],
        "tsConfigPath": "src/tsconfig.app.json",
        "skipCodeGeneration": true
      })
    ]
  };
