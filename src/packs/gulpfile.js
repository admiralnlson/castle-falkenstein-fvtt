const gulp = require("gulp");
const through2 = require("through2");
const yaml = require("js-yaml");
const Datastore = require("nedb");
const cb = require("cb");
const mergeStream = require("merge-stream");
const clean = require("gulp-clean");
const fs = require("fs");
const path = require("path");

const PACKS_SRC = ".";
const PACKS_DST = "../../build/packs";

/* ----------------------------------------- */
/*  Compile Compendia
/* ----------------------------------------- */

function compilePacks() {
  // determine the source folders to process
  const folders = fs.readdirSync(PACKS_SRC).filter((file) => {
    return fs.statSync(path.join(PACKS_SRC, file)).isDirectory();
  });

  // process each folder into a compendium db
  const packs = folders.map((folder) => {
    const db = new Datastore({ filename: path.resolve(__dirname, PACKS_DST, `${folder}.db`), autoload: true });
    return gulp.src(path.join(PACKS_SRC, folder, "/**/*.yaml")).pipe(
      through2.obj((file, enc, cb) => {
        let json = yaml.loadAll(file.contents.toString());
        db.insert(json);
        cb(null, file);
      })
    );
  });
  return mergeStream.call(null, packs);
}

/* ----------------------------------------- */
/*  Other Functions
/* ----------------------------------------- */

function cleanBuild() {
  return gulp.src(`${PACKS_DST}`, { allowEmpty: true }, { read: false }).pipe(clean({force: true}));
}

function watchUpdates() {
  gulp.watch(PACKS_SRC + "/**/*", gulp.series(cleanBuild, compilePacks));
}

/* ----------------------------------------- */
/*  Export Tasks
/* ----------------------------------------- */

exports.clean = gulp.series(cleanBuild);
exports.compile = gulp.series(compilePacks);
exports.build = gulp.series(cleanBuild, compilePacks);
exports.default = gulp.series(cleanBuild, compilePacks, watchUpdates);