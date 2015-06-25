import gulp from 'gulp';
import sourcemaps from 'gulp-sourcemaps';
import source from 'vinyl-source-stream';
import buffer from 'vinyl-buffer';
import browserify from 'browserify';
import watchify from 'watchify';
import babel from 'babelify';

export default class JavascriptBuild {
    constructor(src, fileName, dest, standalone = null) {
        this.src = src;
        this.fileName = fileName;
        this.dest = dest;
        this.standalone = standalone;
        this.bundler = null;
    }

    compile(watch = false) {
        let opts = {
            debug: false
        };

        if (this.standalone !== null) {
            opts['standalone'] = this.standalone;
        }

        this.bundler = watchify( browserify(this.src, opts).transform(babel) );

        if (watch) {
            this.watch();
        }

        this.bundle();
    }

    bundle() {
        this.bundler.bundle()
            .on('error', function (err) { 
                console.error(err); 
                this.emit('end'); })
            .pipe(source(this.fileName))
            .pipe(buffer())
            .pipe(sourcemaps.init({ loadMaps: true }))
            .pipe(sourcemaps.write('./'))
            .pipe(gulp.dest(this.dest));
    }

    watch() {
        this.bundler.on('update', () => {
            console.log('-> bundling...');
            this.bundle();
        });
    }
}
