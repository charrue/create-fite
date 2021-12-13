const gulp = require("gulp");
const gulpLess = require("gulp-less");
const gulpTs = require("gulp-typescript");
const imagemin = require("gulp-imagemin");
const cache = require("gulp-cache");
const rename = require("gulp-rename");

const watchFilesMap = {
  less: "./pages/**/*.less",
  typescript: ["./pages/**/*.ts"],
  image: "./images/**/*.{png,jpe?g,gif,svg}",
};

const less = () => gulp.src(watchFilesMap.less, { since: gulp.lastRun(less) })
  .pipe(gulpLess())
  .pipe(rename({ extname: ".wxss" }))
  .pipe(
    gulp.dest((file) => file.base),
  );

const typescript = () => {
  const tsResult = gulp.src(watchFilesMap.typescript, { since: gulp.lastRun(typescript) })
    .pipe(gulpTs());
  return tsResult.js.pipe(gulp.dest((file) => file.base));
};

const image = () => gulp.src(watchFilesMap.image)
  .pipe(
    cache(
      imagemin([
        imagemin.gifsicle({ interlaced: true }),
        imagemin.jpegtran({ progressive: true }),
        imagemin.optipng({ optimizationLevel: 4 }),
        imagemin.svgo({
          plugins: [
            // 如果有 viewbox 则不需要 width 和 height
            { removeDimensions: true },
          ],
        }),
      ]),
    ),
  )
  .pipe(
    gulp.dest((file) => file.base),
  );

const watchOptions = { events: ["add", "change"] };

const watch = (done) => {
  gulp.watch(watchFilesMap.less, watchOptions, less);
  gulp.watch(watchFilesMap.image, watchOptions, image);
  gulp.watch(watchFilesMap.typescript, watchOptions, typescript);
  done();
};

exports.default = gulp.series(watch, less, typescript);
