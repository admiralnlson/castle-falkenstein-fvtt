const gulp = require("gulp");
const through2 = require("through2");
const yaml = require("js-yaml");
const Datastore = require("nedb");
const cb = require("cb");
const mergeStream = require("merge-stream");
const clean = require("gulp-clean");
const fs = require("fs");
const path = require("path");
const sortArray = require("sort-array");

const PACKS_SRC = "./yaml";
const PACKS_DST = "../../build/packs";

/* ----------------------------------------- */
/*  Compile packs
/* ----------------------------------------- */

function compilePacks() {
  // determine the source files to process
  const files = fs.readdirSync(PACKS_SRC).filter((file) => {
    return fs.statSync(path.join(PACKS_SRC, file)).isFile();
  });

  // process each folder into a compendium db
  const packs = files.map((file) => {
    const fileNoExt = file.replace('.yaml', '');
    const db = new Datastore({ filename: path.resolve(__dirname, PACKS_DST, `${fileNoExt}.db`), autoload: true });
    return gulp.src(path.join(PACKS_SRC, file)).pipe(
      through2.obj((file, enc, cb) => {
        let json = sortArray(yaml.loadAll(file.contents.toString()), { by: 'name' });
        // create complete Foundry items
        for (item of json) {
          if (item.type == "ability") {
            item.data.level = "AV";
          } /*else if (item.type == "spell") {
            item.img = "icons/svg/book.svg";
          }*/

          item.img = `systems/castle-falkenstein/src/cards/${item.data.suit}.svg`;
        }
        //
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