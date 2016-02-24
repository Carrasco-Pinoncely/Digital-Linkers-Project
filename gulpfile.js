var

gulp          =  require('gulp'),
gutil         =  require('gulp-util'),
gulpif        =  require('gulp-if'),
webserver     =  require('gulp-webserver'),
postcss       =  require('gulp-postcss'),
concat        =  require('gulp-concat'),
browserify    =  require('gulp-browserify'),
minifyHTML    =  require('gulp-minify-html'),
uglify        =  require('gulp-uglify'),
precss        =  require('precss'),
cssnano       =  require('cssnano'),
autoprefixer  =  require('autoprefixer');

var env,
    cssrcc,
    jsSources,
    devDir,
    outputDir;

csssrc    = 'process/css/';

jsSources = [
    'components/scripts/smoothscroll.js',
    'components/scripts/map.js'
];

env = process.env.NODE_ENV || 'development';

outputDir = 'builds/development/';

if (env==='development') {
    outputDir = 'builds/development/';
} else {
    outputDir = 'builds/production/';
};

gulp.task('js', function() {
    gulp.src(jsSources)
      .pipe(concat('script.js'))
      .pipe(browserify())
      .pipe(gulpif(env==='production',uglify()))
      .pipe(gulp.dest(outputDir+'js'))
});

gulp.task('html', function() {
    gulp.src('builds/development/*.html')
      .pipe(gulpif(env==='production', minifyHTML()))
      .pipe(gulpif(env==='production', gulp.dest(outputDir)))
});

gulp.task('css', function() {
  gulp.src(csssrc + 'style.css')
  .pipe(postcss([
    precss(),
    autoprefixer(),
    //gulpif(env==='production', cssnano())
    //colorfunctions(),
  ]))
  .on('error', gutil.log)
  .pipe(gulp.dest(outputDir + 'css'));
});

gulp.task('webserver', function() {
  gulp.src('builds/development')
    .pipe(webserver({
      livereload: true,
      open: true
    }));
});

gulp.task('watch', function() {
  gulp.watch(jsSources, ['js']);
  gulp.watch(csssrc + '**/*.css', ['css']);
  gulp.watch('builds/development' + '**/*.html', ['html']);
});

gulp.task('default', ['js','html','css','webserver','watch']);
