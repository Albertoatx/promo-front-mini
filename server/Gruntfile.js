//const grunt = require('./server/node_modules/grunt');

/* NO FUNCIONA
const arrayJSfiles = ['../client/scripts/appfront.js',
                      '../client/scripts/models/*.js', 
                      '../client/scripts/controllers/*.js']; */

const preset_env = require('./node_modules/babel-preset-env');

module.exports = function(grunt) {

  //Configuration
  grunt.initConfig({

    //pass in options to plugins, references to files, etc.
    concat: {
      options: {
        // define a string to put between each file in the concatenated output
       // separator: ';'
      },
      js: {
        src: [
              '../client/scripts/main-jquery.js',
              '../client/scripts/appfront.js', 
              '../client/scripts/models/*.js', 
              '../client/scripts/controllers/*.js'
             ],
        dest: '../client/build/app.bundle.grunt.js'
      },
      vendor: {
        src: [
             '../client/bower_components/jquery/dist/jquery.min.js',
             // '../client/bower_components/*/*.min.js',
              '../client/bower_components/angular/angular.min.js',
              '../client/bower_components/angular-route/angular-route.min.js',
              '../client/bower_components/angular-animate/angular-animate.min.js',
              '../client/bower_components/bootstrap/dist/js/bootstrap.min.js',
              '../client/bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js',
              '../client/bower_components/angularUtils-pagination/dirPagination.js'
             ],
        dest: '../client/build/vendor.bundle.grunt.js'
      },
      css: {
        src: ['../client/bower_components/bootstrap/dist/css/bootstrap.min.css', 
              '../client/styles/misestilos.min.css'],
        dest: '../client/build/styles.bundle.grunt.css'
      },
    }, //concat

    babel: {
      options: {
          "sourceMap": false,
          //Couldn't find preset "env" relative to directory "../client/build"
          //presets: ['env']
          presets: [preset_env]
      },
      dist: {
          files: [{
             // "expand": true,
             // "cwd": "../client/build/", //take all files from  that end with “.jsx” 
             // "src": ["**/*.js"],
              "src": ["../client/build/app.bundle.grunt.js"],
              "dest": "../client/build/app.bundle.babel.js"
              //"ext": "-compiled.js"
          }]
      }
    }, //babel

    
    uglify: {
      options: {
        mangle: false
      },
      uglify_app: {
        files: {
          '../client/build/app.bundle.grunt.js': ['../client/build/app.bundle.babel.js'] //dejo el nombre original (concat)
        }
      }
    }, //uglify  

    // use custom extension for the output file 
    compress: {
      main: {
        options: {
          mode: 'gzip'
        },
        files: [{
          expand: true,
          cwd: '../client/build/',    //target files inside ../client/build/ 
         // cwd: ['../client/build/', '../client/bower_components/jquery/dist/'], 
          src: ['*.grunt.js', '*.grunt.css'],     //all files in the 'cwd'
          dest: '../client/build/',    //save compressed files in this folder
          rename: function(dest, filename) {

            //return dest + filename + '.gz';  //add .gz file extension to each file
            //return dest + filename.replace('.js','.gz.js');   //FIREFOX (but only works with JS files)
            
            var extension = filename.substr(filename.lastIndexOf(".") + 1);
            var new_extension = 'gz.' + extension; 
            return dest + filename.replace(extension, new_extension); //FIREFOX (works also for CSS)
          }
        }],
      },
      //compress jquery file (para el caso de no incluir jquery en el vendor.js)
      /*
      jquery: {
        options: {
          mode: 'gzip'
        },
        files: [{
          expand: true,
          cwd: '../client/bower_components/jquery/dist/',    //target files inside here
          src: ['jquery.min.js'],     //all files in the 'cwd'
          dest: '../client/build/',    //save compressed files in this folder
          rename: function(dest, filename) {
           // return dest + filename + '.gz';  //add .gz file extension to each file
           return dest + filename.replace('.min','.bundle.grunt') + '.gz';

           
          }
        }] 
      } */  //jquery

    } //compress

  });

  // Load Plugins
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-babel');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-compress');

  // Register all tasks, use 'grunt default' command to run all of them together
  grunt.registerTask('default', ['concat', 'babel', 'uglify', 'compress']); 
  
  /*
  grunt.registerTask('concat-js', ['concat:js']); //commnad line 'grunt concat-js'
  grunt.registerTask('concat-vendor', ['concat:vendor']); 
  grunt.registerTask('concat-css', ['concat:css']); 

  grunt.registerTask('uglify', ['uglify']);  //runs all uglifys with command 'grunt uglify'
  grunt.registerTask('uglify-app', ['uglify:uglify_app']);  //command line 'grunt uglify-app'
  */
};