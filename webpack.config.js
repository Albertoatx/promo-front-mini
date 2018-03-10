
//Webpack takes out all our FRONT-END assets and outputs them to a production ready bundle
//------------------------------------------------------------------------------
// * Bundles JS files into 1 file (minimizing HTTP requests)
// * Converts ES2015 or JSX (react) into Vanilla JS
// * Process LESS/SASS files into CSS + only use them where needed
//------------------------------------------------------------------------------
// PLUGINS
//  css-loader:   loads the CSS into our JS file
//  style-loader: adds our CSS into the DOM

const webpack = require('./server/node_modules/webpack');
const path = require('path');
const CompressionPlugin = require("./server/node_modules/compression-webpack-plugin");
const es2015 = require('./server/node_modules/babel-preset-es2015');
const preset_env = require('./server/node_modules/babel-preset-env');

const ExtractTextPlugin = require('./server/node_modules/extract-text-webpack-plugin');

const UglifyJsPlugin = require('./server/node_modules/uglifyjs-webpack-plugin');

module.exports = {
  //define an entry point
  entry: {  
    'jquery': './client/bower_components/jquery/dist/jquery.min.js',
    'vendor': './client/scripts/vendor-files', //vendor file will include all our 3rd party modules
   /* 'styles.css': './client/scripts/style-files', */
   /* 'vendor2': './client/scripts/vendor-files2', 			*/
    'app': './client/scripts/app-files',	//our application file will include our Angular files
    /* DOES NOT WORK
    'styles.css': [
      path.resolve(__dirname + '/client/bower_components/bootstrap/dist/css/bootstrap.min.cs'),
      path.resolve(__dirname + '/client/styles/misestilos.css')
    ] */

  },
  
  //what kind of module extensions to resolve (imports with .js or .ts)
  resolve: {   
    extensions: ['.js', '.ts', '.css'],
  },

  // Define output point where webpack will create the files (all with .js extension)
  // To get an absolute path for current directory use __dirname
  output: { 
    path: __dirname + '/client/dist',  //has to be an absolute path
    filename: '[name].bundle.js',
    //filename: 'bundle.[name]',
  },

  // List of modules webpack will use
  module: { 
    
    rules: [
      // Babel transformation using preset-env (NEW WAY)
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: './server/node_modules/babel-loader',
          options: {
            presets: [preset_env]
            //presets: ['@babel/preset-env']
          }
        }
      },

      //To merge multiple CSS using webpack (NOT a good option!!!!!!!)
      /* DOES NOT WORK
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: './server/node_modules/style-loader',
          use: {
            loader: './server/node_modules/css-loader',
            options: {
              minimize: false  //Minification option
            }
          }
        })
      } */

    ] //rules
    , 
    
    loaders: [ 

      /* // Babel transformation using 'es2015' preset (OLD WAY)
      {
          test: /\.js$/,
          exclude: /(node_modules|bower_components)/,
          loader: './server/node_modules/babel-loader',
          query: {
            presets: [es2015]
            //  presets: [__dirname + 'server/node_modules/babel-preset-es2015']
          }
      },
      */

      // ONLY Makes sense when we want each JS file to have its own CSS style
      /*
      {
          test: /\.css$/,  
          loader: './server/node_modules/style-loader!./server/node_modules/css-loader'
      }
      */

    ] //loaders

  }, //module

  plugins: [

    //Merged CSS file (no funciona como quiero)
    //new ExtractTextPlugin("styles.css"),  


    //UglifyJS Plugin uglifies the output AFTER bundling
    
    new UglifyJsPlugin({
      test: /\.js$/i,
      include: /^app.*[a-z]\.js$/, //solo aplicarsela a "app.bundle.js"
      //exclude: /^vendor.*[a-z]\.js$/,  //vendor.bundle.js
      mangle: false,
      //compress: { unused:false }
      
      //NO hace caso a 'uglifyOptions' porque solo para versiones >= v1.0.0 de uglifyjs-webpack-plugin
      //
      /*
      uglifyOptions: {
        output: {
          beautify: true
        },
        compress: false,
        //mangle: false,
        
        mangle: {
          toplevel: false, //mangle names declared in the top level scope.
          eval: false, //mangle names visible in scopes where 'eval' or 'with' are used.
          reserved: ['$','require','exports'] 
        },

        warnings: true
      } */
    }), 

    new CompressionPlugin({
      asset: "[path].gz[query]",
      algorithm: "gzip",
      test: /\.js$|\.css$|\.html$/,
      deleteOriginalAssets: false  //delete the created JS bundle file (used as entry for compression)
    /*  threshold: 10240,  */ //Only assets bigger than this size are processed (bytes)
    /*  minRatio: 0.8   */    //Only assets that compress better than this ratio are processed
    }),

    

    /* CUIDADO, este plugin me hace petar la app, lo dejo comentado
    new webpack.optimize.CommonsChunkPlugin({ //optimize to bundle a module ONLY ONCE
      name: ['app', 'vendor','vendor2']
    })*/
  ] 
};
