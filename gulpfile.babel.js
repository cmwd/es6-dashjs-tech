import gulp from 'gulp';
import JSBuild from './gulp/javascript.js';

var indexJs = new JSBuild('./src/js/index.js', 'index.js', './dist', 'MyPublicLib');

gulp.task('build', () => { return indexJs.compile(); });
gulp.task('watch', () => { return indexJs.compile(true); });

gulp.task('default', ['build']);
