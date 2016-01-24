var gulp = reaquire('gulp');
var browserSync = reaquire('browser-sync');

gulp.task('browserSync', function() {
	browserSync.init({
		server: {
			baseDir: 'app'
		}
	});
})