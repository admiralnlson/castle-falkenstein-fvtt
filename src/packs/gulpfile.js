const gulp = require("gulp");
const yaml = require("js-yaml");
const fs = require("fs");
const fsp = require("fs/promises");
const os = require("os");
const path = require("path");
const sha256 = require("crypto-js/sha256");

const PACKS_SRC = path.join(__dirname, "yaml");
const PACKS_DST = path.join(__dirname, "..", "..", "build", "packs");

function hash(str, len) {
  return sha256(str).toString().substring(0, len);
}

function applyDefaults(item) {
  if (item.type === "ability") {
    if (!item.system.level) item.system.level = "AV";
    if (!item.img) item.img = `systems/castle-falkenstein/src/cards/${item.system.suit}.svg`;
  } else if (item.type === "spell") {
    if (!item.img) item.img = `systems/castle-falkenstein/src/cards/${item.system.suit}.svg`;
  } else if (item.type === "weapon") {
    if (!item.img) item.img = "systems/castle-falkenstein/src/img/saber-and-pistol.png";
    item.system.ammunition = item.system.ammunition_max;
  }
}

async function rimraf(target) {
  await fsp.rm(target, { recursive: true, force: true });
}

async function compilePacks() {
  const { compilePack } = await import("@foundryvtt/foundryvtt-cli");

  const yamlFiles = fs.readdirSync(PACKS_SRC).filter(f => {
    return f.endsWith(".yaml") && fs.statSync(path.join(PACKS_SRC, f)).isFile();
  });

  const stagingRoot = await fsp.mkdtemp(path.join(os.tmpdir(), "cf-packs-"));
  try {
    for (const file of yamlFiles) {
      const packName = path.basename(file, ".yaml");
      const docs = yaml.loadAll(fs.readFileSync(path.join(PACKS_SRC, file), "utf8"));

      const filenameHash13 = hash(packName, 13);
      if (docs.length > 999) {
        throw new Error(`Too many items in pack ${packName} (${docs.length}); _id collision risk.`);
      }

      const stagingDir = path.join(stagingRoot, packName);
      await fsp.mkdir(stagingDir, { recursive: true });

      docs.forEach((item, i) => {
        applyDefaults(item);
        const counter = i + 1;
        item._id = filenameHash13 + ("00" + counter).slice(-3);
        item.sort = counter * 10000;
        item._key = `!items!${item._id}`;
        const safeName = (item.name || item._id).replace(/[^A-Za-z0-9_-]/g, "_");
        fs.writeFileSync(
          path.join(stagingDir, `${safeName}_${item._id}.json`),
          JSON.stringify(item, null, 2)
        );
      });

      const destDir = path.join(PACKS_DST, packName);
      await rimraf(destDir);
      await compilePack(stagingDir, destDir);
    }
  } finally {
    await rimraf(stagingRoot);
  }
}

async function cleanBuild() {
  await rimraf(PACKS_DST);
}

function watchUpdates() {
  gulp.watch(PACKS_SRC + "/**/*", gulp.series(cleanBuild, compilePacks));
}

exports.clean = gulp.series(cleanBuild);
exports.compile = gulp.series(compilePacks);
exports.build = gulp.series(cleanBuild, compilePacks);
exports.default = gulp.series(cleanBuild, compilePacks, watchUpdates);
