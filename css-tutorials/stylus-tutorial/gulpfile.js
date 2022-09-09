var gulp = require('gulp')
var stylus = require('gulp-stylus')
var typographic = require('typographic')
var nib = require('nib')

gulp.task('styles', () => {
    gulp.src('styles.styl')
        .pipe(stylus({
            use: [typographic(), nib()]
        }))
        .pipe(gulp.dest('./'))
})

gulp.task('watch:styles', () => {
    gulp.watch('styles.styl', gulp.series('styles'))
})