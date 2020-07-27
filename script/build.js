const fs = require("fs");
const rimraf = require("rimraf");
const esbuild = require("esbuild");
const packageJson = require("../package.json");
const csso = require("csso");

const toCamelCase = (name) =>
  name
    .split("-")
    .map((str) => str.charAt(0).toUpperCase() + str.slice(1))
    .join("");

rimraf.sync("dist/*");

const commonOptions = {
  bundle: true,
  write: true,
  entryPoints: ["src/index.js"],
  outfile: `dist/${packageJson.name}`,
  globalName: toCamelCase(packageJson.name),
};
const platforms = ["browser", "node"];
const formats = ["iife", "cjs", "esm"];
for (const format of formats) {
  for (const platform of platforms) {
    const option = {
      ...commonOptions,
      format,
      platform,
    };

    option.outfile =
      commonOptions.outfile + "." + format + "." + platform + ".js";
    esbuild.buildSync(option);

    option.outfile =
      commonOptions.outfile + "." + format + "." + platform + ".min.js";
    option.minify = true;
    esbuild.buildSync(option);
  }
}

fs.createReadStream("src/index.css").pipe(
  fs.createWriteStream("dist/index.css")
);
fs.writeFileSync(
  "dist/index.min.css",
  csso.minify(fs.readFileSync("src/index.css", { encoding: "utf8" })).css
);
