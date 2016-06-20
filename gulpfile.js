var args        = require('yargs').argv,
    gulp        = require('gulp'),
    $           = require('gulp-load-plugins')(),
    browserSync = require('browser-sync').create(),
    del         = require('del'),
    gulpsync    = $.sync(gulp);


var isProduction = false;
var useSourceMaps = false;

// CONFIG PATHS
var config = {
  scripts: {
    name: 'app.js',
    src: [
      './src/scripts/constants.js',
      './src/scripts/file-manager/**/*.js',
      './src/scripts/app.js',
      './src/scripts/controllers/**/*.js',
      './src/scripts/directives/*.js',
      './src/scripts/services/*.js',
      './src/scripts/filters/*.js',
      './src/scripts/routes.js'
    ],
    dest: 'dist/scripts/'
  },
  vendors: {
    src:     require('./src/vendors.json'),
    destJs:  'dist/scripts/',
    destCss: 'dist/styles/'
  },
  views: {
    src:   './src/views/**/**/*',
    dest:  './dist/views/',
    watch: ['./index.html', './src/views/**/**/*']
  },
  styles: {
    src:   './src/styles/app.less',
    dest:  './dist/styles/',
    watch: ['./src/styles/**/*.less']
  }
};


//---------------
// TASKS
//---------------

// APP SCRIPTS
gulp.task('scripts', function() {
  log.info('Building scripts..');
  return gulp.src(config.scripts.src)
    .pipe( $.if( useSourceMaps, $.sourcemaps.init() ))
    .pipe($.ngAnnotate())
    .on('error', handleError)
    .pipe($.concat(config.scripts.name))
    .pipe( $.if(isProduction, $.uglify({preserveComments:'some'}) ))
    .on('error', handleError)
    .pipe( $.if( useSourceMaps, $.sourcemaps.write() ))
    .pipe(gulp.dest(config.scripts.dest));
});

// APP STYLES
gulp.task('styles', function() {
  log.info('Building application styles..');
  return gulp.src(config.styles.src)
    .pipe( $.if( useSourceMaps, $.sourcemaps.init() ))
    // .pipe($.sass({outputStyle: 'compressed'}))
    .pipe($.less())
    .pipe($.autoprefixer())
    .on('error', handleError)
    //.pipe( $.if( isProduction, $.minifyCss() ))
    .pipe( $.if( useSourceMaps, $.sourcemaps.write() ))
    .pipe(gulp.dest(config.styles.dest));
});

// APP VENDORS
gulp.task('vendors', function() {
  log.info('Building vendors assets..');

  var jsFilter = $.filter('**/*.js', {restore: true});
  var cssFilter = $.filter('**/*.css', {restore: true});

  return gulp.src(config.vendors.src)
    .pipe($.expectFile(config.vendors.src))
    .pipe(jsFilter)
    .pipe( $.if( useSourceMaps, $.sourcemaps.init() ))
    .pipe($.concat('vendors.js'))
    .pipe($.if( isProduction, $.uglify({preserveComments:'some'}) ))
    .on('error', handleError)
    .pipe( $.if( useSourceMaps, $.sourcemaps.write() ))
    .pipe(gulp.dest(config.vendors.destJs))
    .pipe(jsFilter.restore)
    .pipe(cssFilter)
    .pipe($.concat('vendors.css'))
    .pipe($.if( isProduction, $.minifyCss() ))
    .pipe(gulp.dest(config.vendors.destCss));
});

// APP VIEWS
gulp.task('views', function() {
  log.info('Building application views..');
  return gulp.src(config.views.src)
    .pipe( $.if( isProduction, $.htmlMinifier({collapseWhitespace: true}) ))
    .pipe(gulp.dest(config.views.dest));
});

/* ==============
 * WATCH TASK
 * ==============*/

gulp.task('watch', ['server'], function() {

  gulp.watch(config.views.watch, function(event){
    gulp.run('views');
    browserSync.reload;
  });
  gulp.watch(config.styles.watch, function(event){
    gulp.run('styles');
    browserSync.reload;
  });
  gulp.watch(config.scripts.src, function(event){
    gulp.run('scripts');
    browserSync.reload;
  });
  gulp.watch('./src/vendors.json', function(event){
    gulp.run('vendors');
    browserSync.reload;
  });

});

/* ==============
 * SERVER START
 * ==============*/

gulp.task('server', ['assets'], function () {
  var bsOptions = {
    server: {
      notify: false,
      baseDir: "./dist/",
      port: 8000
    }
  };
  browserSync.init(bsOptions);
});

/* ==============
 * PRIVATE TASKS
 * ==============*/

gulp.task('assets',[
  'views',
  'styles',
  'scripts',
  'vendors'
]);

// Clean Dist folder
gulp.task('clear', ['clean']);
gulp.task('clean', function () {
  return del([
    './dist/scripts',
    './dist/styles',
    './dist/views'
  ], {force:true});
});

gulp.task('prod', ['clean'], function() {
  log.info('Starting production build...');
  isProduction = true;
  useSourceMaps = false;
  return gulp.src('.');
});

gulp.task('dev', ['clean'], function() {
  log.info('Starting development build...');
  isProduction = false;
  useSourceMaps = true;
  return gulp.src('.');
});


/* ==============
 * PUBLIC TASKS
 * ==============*/

gulp.task('default', gulpsync.sync(['dev','assets', 'watch']), function(){

  log.success('************');
  log.success('* All Done *');
  log.success('************');

});

gulp.task('build', gulpsync.sync(['prod', 'assets']), function(){

  log.info('**************');
  log.info('* Build Done *');
  log.info('**************');

});
/////////////////////


// Error handler
function handleError(err) {
  log.error(err.toString());
  this.emit('end');
}

// log to console
var log = {
  info: function (msg) {
    $.util.log( $.util.colors.blue( msg ) );
  },
  success: function (msg) {
    $.util.log( $.util.colors.green( msg ) );
  },
  error: function (msg) {
    $.util.log( $.util.colors.red( msg ) );
  }
};
