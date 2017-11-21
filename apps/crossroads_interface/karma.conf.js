// Karma configuration
// Generated on Mon Mar 27 2017 12:48:36 GMT-0400 (EDT)

module.exports = function(config) {
    config.set({

        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: '',


        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['jasmine', 'browserify'],


        // list of files / patterns to load in the browser
        files: [
            'node_modules/jquery/dist/jquery.js',
            'node_modules/babel-polyfill/dist/polyfill.js',
            'node_modules/flickity/dist/flickity.pkgd.js',
            'node_modules/crds-card-carousel/dist/crds-card-carousel-v0.0.1.js',
            'test/**/*.js'
        ],


        // list of files to exclude
        exclude: [],


        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {
            'web/static/js/**/*.js': ['browserify'],
            'test/**/*.js': ['browserify']
        },

        browserify: {
            debug: true,
            transform: ['babelify'],
            configure: function browserify(bundle) {
                bundle.once('prebundle', function prebundle() {
                    bundle.transform('babelify', { presets: ['es2015'] });
                });
            }
        },

        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ['progress'],


        // web server port
        port: 9876,


        // enable / disable colors in the output (reporters and logs)
        colors: true,


        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,


        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,


        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: ['PhantomJS'],


        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: false,

        // Concurrency level
        // how many browser should be started simultaneous
        concurrency: Infinity
    })
}
