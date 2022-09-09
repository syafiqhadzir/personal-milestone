var gulp = require('gulp')
var postcss = require('gulp-postcss')
// var csswring = require('csswring')
// var sass = require('gulp-sass')(require('sass'))
// var stylus = require('gulp-stylus')
// var cssnext = require('cssnext') // Vulnerable
// var precss = require('precss') // Vulnerable
var autoprefixer = require('autoprefixer')
var lost = require('lost')
var rucksack = require('rucksack-css')

gulp.task('styles', () => {
    var processors = [
        lost,
        rucksack,
        // precss({}),
        autoprefixer({}),
        // cssnext({})
    ]
    return gulp.src('styles.css')
        // .pipe(stylus())
        .pipe(postcss(processors))
        .pipe(gulp.dest('./dist'))

    // Sass
    // return gulp.src('styles.scss')
    //     .pipe(sass())
    //     .pipe(postcss(processors))
    //     .pipe(gulp.dest('./dist'))
})

gulp.task('watch:styles', () => {
    gulp.watch('**/*.css', ['styles'])
})