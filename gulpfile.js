const { src, dest, watch, parallel, series } = require("gulp");

const scss = require("gulp-sass")(require("sass"));
const concat = require("gulp-concat");
const uglify = require("gulp-uglify-es").default;
const browserSync = require("browser-sync").create();
const autoprefixer = require("gulp-autoprefixer");
const clean = require("gulp-clean");
const webp = require("gulp-webp");
const imagemin = require("gulp-imagemin");
const newer = require("gulp-newer");
const svgSpite = require("gulp-svg-sprite");
const fonter = require("gulp-fonter");
const ttf2woff2 = require("gulp-ttf2woff2");
const fileinclude = require("gulp-file-include");

const replace = require("gulp-replace");
let webphtml = require("gulp-webp-html-nosvg");
const cleanCSS = require("gulp-clean-css");
const gcmq = require("gulp-group-css-media-queries");

function pages() {
  return src("app/pages/*.html")
    .pipe(fileinclude())
    .pipe(replace(/@img\//g, "images/dist/"))
    .pipe(webphtml())
    .pipe(dest("app"))
    .pipe(browserSync.stream());
}

function fonts() {
  return src("app/fonts/src/*.*")
    .pipe(fonter({ formats: ["woff", "ttf"] }))
    .pipe(src("app/fonts/*.ttf"), { encoding: false })
    .pipe(ttf2woff2())
    .pipe(dest("app/fonts"));
}

function images() {
  return src(["app/images/src/*.*", "!app/images/src/*.svg"], {
    encoding: false,
  })
    .pipe(newer("app/images/dist"))
    .pipe(webp())
    .pipe(dest("app/images/dist"))
    .pipe(src(["app/images/src/*.*", "!app/images/src/*.svg"]))
    .pipe(newer("app/images/dist"))
    .pipe(imagemin())
    .pipe(dest("app/images/dist"))
    .pipe(src("app/images/src/*.svg"))
    .pipe(dest("app/images/dist"));
}

function scripts() {
  return src(
    [
      "app/js/main.js",
      "app/js/accorgion.js",
      "app/js/tabs.js",
      "app/js/dates.js",
    ],
    {
      sourcemaps: true,
    }
  )
    .pipe(concat("main.min.js"))
    .pipe(uglify())
    .pipe(dest("app/js"))
    .pipe(browserSync.stream());
}

function styles() {
  return src(["app/scss/style.scss", "app/components/**/*.scss"], {
    sourcemaps: true,
  })
    .pipe(
      autoprefixer({ overrideBrowserslist: ["last 10 version"], grid: true })
    )
    .pipe(scss({ style: "compressed" }))
    .pipe(gcmq())
    .pipe(cleanCSS())
    .pipe(concat("style.min.css"))
    .pipe(dest("app/css"))
    .pipe(browserSync.stream());
}

function watching() {
  browserSync.init({
    server: {
      baseDir: "app/",
    },
  });
  watch(["app/scss/*.scss", "app/components/**/*.scss"], styles);
  watch(["app/images/src"], images);
  watch(
    [
      "app/js/main.js",
      "app/js/accorgion.js",
      "app/js/tabs.js",
      "app/js/dates.js",
    ],
    scripts
  );
  watch(["app/pages/*", "app/components/**/*.html"], pages);
  watch(["app/*.html"]).on("change", browserSync.reload);
}

function cleanDist() {
  return src("dist").pipe(clean());
}

function building() {
  return src(
    [
      "app/*.html",
      "app/css/style.min.css",
      "app/images/dist/*.*",
      "!app/images/dist/*.svg",
      // "app/images/dist/sprite.svg",
      "app/fonts/*.*",
      "app/js/main.min.js",
    ],
    {
      base: "app",
    }
  ).pipe(dest("dist"));
}

exports.styles = styles;
exports.images = images;
exports.fonts = fonts;
exports.pages = pages;
// exports.sprite = sprite;
exports.scripts = scripts;
exports.watching = watching;

exports.build = series(cleanDist, building);
exports.default = parallel(styles, images, scripts, pages, watching);
