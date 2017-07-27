var gulp = require('../node_modules/gulp');
var concat = require('../node_modules/gulp-concat');
var rename = require('../node_modules/gulp-rename');
var sass = require('../node_modules/gulp-sass');
var livereload = require('../node_modules/gulp-livereload');
var filesCSS = ([
    "css.scss"
]);


gulp.task('sass', function () {
    return gulp.src(filesCSS)
            .pipe(concat('./*.scss'))
            .pipe(sass({outputStyle: 'compact'}).on('error', sass.logError))
            .pipe(rename('css.css'))
			
            .pipe(gulp.dest(''))
            .pipe(livereload());
});
gulp.task('watch', function () {
    livereload.listen();
    gulp.watch(filesCSS, ['sass']);
});

gulp.task('default', ['sass', 'watch']);
