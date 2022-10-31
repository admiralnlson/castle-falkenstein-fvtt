const gulp = require("gulp");
const through2 = require("through2");
const yaml = require("js-yaml");
const Datastore = require("nedb");
const cb = require("cb");
const mergeStream = require("merge-stream");
const clean = require("gulp-clean");
const fs = require("fs");
const path = require("path");
//const sortArray = require("sort-array");
const sha256 = require("crypto-js/sha256");

const PACKS_SRC = "./yaml";
const PACKS_DST = "../../build/packs";

/* ----------------------------------------- */
/*  Compile packs
/* ----------------------------------------- */

function hash(str, len) {
  let hash = sha256(str).toString().substring(0, len);
  return hash;
}

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
        let json = yaml.loadAll(file.contents.toString());
        //json = sortArray(json, { by: 'name' });

        const filenameHash13 = hash(fileNoExt, 13); // 13 chars from filename + 3 from item = 16 (nedb id length)

        let counter = 1;
        for (item of json) {
          // supplement the definitions with some key properties
          if (item.type == "ability") {
            item.system.level = "AV";
            item.img = `systems/castle-falkenstein/src/cards/${item.system.suit}.svg`;
          } else if (item.type == "spell") {
            item.img = `systems/castle-falkenstein/src/cards/${item.system.suit}.svg`;
          } else if (item.type == "weapon") {
            item.system.ammunition = item.system.ammunition_max;
            item.img = `icons/svg/item-bag.svg`;
          }

          // add an nedb _id that is deterministic to avoid FoundryVTT reording them when saving
          if (counter > 999) {
            console.error("Too many items in the pack");
          }
          item._id = filenameHash13 + ("00" + counter).slice(-3); // 13 chars from filename + 3 from item = 16 (nedb id length)
          item.sort = counter;
          ++counter;
        }

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